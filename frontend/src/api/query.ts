import { request, gql } from 'graphql-request'

export const queryFlagList = gql`
{
  registereds {
    id
    flagUid
    flagRecord_title
    flagRecord_description
    flagRecord_depositValue
    flagRecord_expireTime
  }
}
`