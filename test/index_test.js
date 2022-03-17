const assert = require('chai').assert
const createRequest = require('../index.js').createRequest

describe('createRequest', () => {
  const jobID = '1'

  context('successful calls', () => {
    const requests = [
      { name: 'id not supplied', testData: { data: { chainId: '1', address: '0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d' } } },
      { name: 'chainId/address', testData: { id: jobID, data: { chainId: '1', address: '0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d' } } }
    ]

    requests.forEach(req => {
      it(`${req.name}`, (done) => {
        createRequest(req.testData, (statusCode, data) => {
          assert.equal(statusCode, 200)
          assert.equal(data.jobRunID, jobID)
          assert.isNotEmpty(data.data)
          // assert.isAbove(Number(data.result), 0)
          // assert.isAbove(Number(data.data.result), 0)
          done()
        })
      })
    })
  })

  context('error calls', () => {
    const requests = [
      { name: 'empty body', testData: {} },
      { name: 'empty data', testData: { data: {} } },
      { name: 'address not supplied', testData: { id: jobID, data: { chainId: '1' } } },
      { name: 'chainId not supplied', testData: { id: jobID, data: { address: '0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d' } } }
    ]

    requests.forEach(req => {
      it(`${req.name}`, (done) => {
        createRequest(req.testData, (statusCode, data) => {
          assert.equal(statusCode, 500)
          assert.equal(data.jobRunID, jobID)
          assert.equal(data.status, 'errored')
          assert.isNotEmpty(data.error)
          done()
        })
      })
    })
  })
})
