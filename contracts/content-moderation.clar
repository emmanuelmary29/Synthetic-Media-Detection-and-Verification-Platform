;; Content Moderation Contract

(define-constant contract-owner tx-sender)
(define-constant err-owner-only (err u100))
(define-constant err-not-found (err u101))

(define-data-var last-request-id uint u0)

(define-map takedown-requests
  { request-id: uint }
  {
    media-hash: (buff 32),
    requester: principal,
    status: (string-ascii 20),
    timestamp: uint
  }
)

(define-public (submit-takedown-request (media-hash (buff 32)))
  (let
    (
      (new-id (+ (var-get last-request-id) u1))
    )
    (map-set takedown-requests
      { request-id: new-id }
      {
        media-hash: media-hash,
        requester: tx-sender,
        status: "pending",
        timestamp: block-height
      }
    )
    (var-set last-request-id new-id)
    (ok new-id)
  )
)

(define-public (resolve-takedown-request (request-id uint) (new-status (string-ascii 20)))
  (let
    (
      (request (unwrap! (map-get? takedown-requests { request-id: request-id }) err-not-found))
    )
    (asserts! (is-eq tx-sender contract-owner) err-owner-only)
    (map-set takedown-requests
      { request-id: request-id }
      (merge request { status: new-status })
    )
    (ok true)
  )
)

(define-read-only (get-takedown-request (request-id uint))
  (map-get? takedown-requests { request-id: request-id })
)

