const ExposedExchangeRateTracker = artifacts.require('ExposedExchangeRateTracker.sol')
const chai = require('./helpers/chai')

contract('DrawExchangeRates', () => {

  let exchangeRates

  beforeEach(async () => {
    exchangeRates = await ExposedExchangeRateTracker.new()
    await exchangeRates.setExchangeRateTracker([1, 4, 10, 55])
    chai.assert.equal(await exchangeRates.get(0), 1)
    chai.assert.equal(await exchangeRates.get(1), 4)
    chai.assert.equal(await exchangeRates.get(2), 10)
  })

  it('should fail for empty arrays', async () => {
    await exchangeRates.setExchangeRateTracker([])
    await chai.assert.isRejected(exchangeRates.search(0), /ExchangeRateTracker\/empty/)
  })

  it('should pick the last when duplicates exist', async () => {
    await exchangeRates.setExchangeRateTracker([1, 1, 2, 2, 2, 3, 3])
    chai.assert.equal(await exchangeRates.search(1), 1)
    chai.assert.equal(await exchangeRates.search(2), 4)
    chai.assert.equal(await exchangeRates.search(3), 6)
  })

  it('should not accept draw ids smaller than smallest', async () => {
    await chai.assert.isRejected(exchangeRates.search(0), /ExchangeRateTracker\/bounds/)
  })

  it('return a matching value', async () => {
    chai.assert.equal(await exchangeRates.search(4), 1)
  })

  it('returns the closest less than', async () => {
    chai.assert.equal(await exchangeRates.search(5), 1)
  })

  it('returns the closest less than', async () => {
    chai.assert.equal(await exchangeRates.search(500), 3)
  })

  it('returns the first', async () => {
    chai.assert.equal(await exchangeRates.search(1), 0)
  })

  it('returns the first', async () => {
    chai.assert.equal(await exchangeRates.search(2), 0)
  })

  it('returns the last', async () => {
    chai.assert.equal(await exchangeRates.search(55), 3)
  })
})