import * as API from '../api.js'

import normalFetch from './normal.fetch.test.json'
import normalResponse from './normal.response.test.json'

test('Normal MBTA with skipping AMTRAK', async () => {
  fetch.mockResponseOnce(JSON.stringify(normalFetch))
  let response = await API.getTimetable();
 
  response = response.timetable.filter(function (record) {
    return record.carrier === 'MBTA'
  })

  const expectedResponse = normalResponse.timetable;
  
  expect(response).toStrictEqual(expectedResponse)
})