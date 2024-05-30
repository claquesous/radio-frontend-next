import cookie from 'cookie'

const cookieName = 'claqradio_streampreference'

export const setStreamPreference = ({id, name}) => {
  cookie.set(cookieName, JSON.stringify({id, name}), { expires: 365 })
}

export const getStreamPreference = () => {
  const preference = cookie.get(cookieName) || '{}'
  return JSON.parse(preference)
}

