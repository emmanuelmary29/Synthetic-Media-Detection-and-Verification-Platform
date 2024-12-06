;; Media Analysis Contract

(define-constant contract-owner tx-sender)
(define-constant err-owner-only (err u100))
(define-constant err-not-found (err u101))

(define-data-var last-analysis-id uint u0)

(define-map media-analyses
  { analysis-id: uint }
  {
    media-hash: (buff 32),
    result: (string-ascii 20),
    confidence: uint,
    analyzer: principal,
    timestamp: uint
  }
)

(define-public (submit-analysis (media-hash (buff 32)) (result (string-ascii 20)) (confidence uint))
  (let
    (
      (new-id (+ (var-get last-analysis-id) u1))
    )
    (map-set media-analyses
      { analysis-id: new-id }
      {
        media-hash: media-hash,
        result: result,
        confidence: confidence,
        analyzer: tx-sender,
        timestamp: block-height
      }
    )
    (var-set last-analysis-id new-id)
    (ok new-id)
  )
)

(define-read-only (get-analysis (analysis-id uint))
  (map-get? media-analyses { analysis-id: analysis-id })
)

(define-read-only (get-last-analysis-id)
  (ok (var-get last-analysis-id))
)

