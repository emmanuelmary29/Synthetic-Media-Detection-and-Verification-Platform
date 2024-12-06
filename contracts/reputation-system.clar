;; Reputation System Contract

(define-constant contract-owner tx-sender)
(define-constant err-owner-only (err u100))
(define-constant err-not-found (err u101))

(define-map user-reputation
  { user: principal }
  { score: int }
)

(define-public (update-reputation (user principal) (change int))
  (let
    (
      (current-score (default-to { score: 0 } (map-get? user-reputation { user: user })))
    )
    (map-set user-reputation
      { user: user }
      { score: (+ (get score current-score) change) }
    )
    (ok true)
  )
)

(define-read-only (get-reputation (user principal))
  (default-to { score: 0 } (map-get? user-reputation { user: user }))
)

