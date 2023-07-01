import type { NextPage } from 'next'
import PrivacyPolicy from '@/components/Privacy/PrivacyPolicy'

export const getStaticProps = async () => {
  return {
    props: {
      isPublic: true
    }
  }
}

const Page: NextPage = () => {
  return (<PrivacyPolicy />)
}

export default Page
