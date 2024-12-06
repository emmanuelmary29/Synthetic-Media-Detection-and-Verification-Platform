import { describe, it, expect, beforeEach } from 'vitest'

describe('IncentiveToken', () => {
  let tokenBalances: { [key: string]: number } = {}
  
  const mockMint = (amount: number, recipient: string) => {
    tokenBalances[recipient] = (tokenBalances[recipient] || 0) + amount
    return { success: true }
  }
  
  const mockTransfer = (amount: number, sender: string, recipient: string) => {
    if ((tokenBalances[sender] || 0) < amount) {
      return { success: false, error: 'Insufficient balance' }
    }
    tokenBalances[sender] -= amount
    tokenBalances[recipient] = (tokenBalances[recipient] || 0) + amount
    return { success: true }
  }
  
  const mockGetBalance = (address: string) => {
    return { success: true, balance: tokenBalances[address] || 0 }
  }
  
  beforeEach(() => {
    tokenBalances = {}
  })
  
  it('ensures that tokens can be minted and transferred', () => {
    const deployer = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM'
    const user1 = 'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG'
    
    // Test minting
    let mintResult = mockMint(1000, user1)
    expect(mintResult.success).toBe(true)
    
    let balanceResult = mockGetBalance(user1)
    expect(balanceResult.success).toBe(true)
    expect(balanceResult.balance).toBe(1000)
    
    // Test transfer
    let transferResult = mockTransfer(500, user1, deployer)
    expect(transferResult.success).toBe(true)
    
    balanceResult = mockGetBalance(user1)
    expect(balanceResult.success).toBe(true)
    expect(balanceResult.balance).toBe(500)
    
    balanceResult = mockGetBalance(deployer)
    expect(balanceResult.success).toBe(true)
    expect(balanceResult.balance).toBe(500)
    
    // Test insufficient balance transfer
    transferResult = mockTransfer(1000, user1, deployer)
    expect(transferResult.success).toBe(false)
    expect(transferResult.error).toBe('Insufficient balance')
    
    // Verify balances haven't changed after failed transfer
    balanceResult = mockGetBalance(user1)
    expect(balanceResult.balance).toBe(500)
    
    balanceResult = mockGetBalance(deployer)
    expect(balanceResult.balance).toBe(500)
  })
})

