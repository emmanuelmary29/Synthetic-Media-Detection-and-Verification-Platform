import { describe, it, expect, beforeEach } from 'vitest'

describe('MediaAnalysis', () => {
  beforeEach(() => {
    // Reset state between tests
  })
  
  it('ensures that media analysis can be submitted and retrieved', () => {
    const deployer = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM'
    const user1 = 'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG'
    
    let block = chain.mineBlock([
      Tx.contractCall('media-analysis', 'submit-analysis', [
        types.buff(Buffer.from('1234567890abcdef', 'hex')),
        types.ascii("synthetic"),
        types.uint(80)
      ], user1)
    ]);
    block.receipts[0].result.expectOk().expectUint(1);
    
    let result = chain.callReadOnlyFn('media-analysis', 'get-analysis', [types.uint(1)], deployer);
    let analysis = result.result.expectSome().expectTuple();
    expect(analysis.result).toBe("synthetic")
    expect(analysis.confidence).toBe(80)
    expect(analysis.analyzer).toBe(user1)
  })
});

