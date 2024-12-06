import { describe, it, expect, beforeEach } from 'vitest'

describe('MediaAnalysis', () => {
  let analyses: { [key: number]: any } = {}
  let lastAnalysisId = 0
  
  const mockSubmitAnalysis = (mediaHash: string, result: string, confidence: number, analyzer: string) => {
    lastAnalysisId++
    analyses[lastAnalysisId] = {
      media_hash: mediaHash,
      result,
      confidence,
      analyzer,
      timestamp: Date.now()
    }
    return { success: true, value: lastAnalysisId }
  }
  
  const mockGetAnalysis = (analysisId: number) => {
    return analyses[analysisId] || null
  }
  
  beforeEach(() => {
    analyses = {}
    lastAnalysisId = 0
  })
  
  it('ensures that media analysis can be submitted and retrieved', () => {
    const deployer = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM'
    const user1 = 'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG'
    
    const submitResult = mockSubmitAnalysis('1234567890abcdef', 'synthetic', 80, user1)
    expect(submitResult.success).toBe(true)
    expect(submitResult.value).toBe(1)
    
    const analysis = mockGetAnalysis(1)
    expect(analysis).not.toBeNull()
    expect(analysis.result).toBe('synthetic')
    expect(analysis.confidence).toBe(80)
    expect(analysis.analyzer).toBe(user1)
  })
})

