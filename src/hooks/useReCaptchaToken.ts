'use client'

import { useCallback } from 'react'
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3'

export function useReCaptchaToken(action = 'form_submit') {
  const { executeRecaptcha } = useGoogleReCaptcha()

  const getToken = useCallback(async (): Promise<string | null> => {
    if (!executeRecaptcha) return null
    try {
      return await executeRecaptcha(action)
    } catch (error) {
      console.error('reCAPTCHA execution failed:', error)
      return null
    }
  }, [executeRecaptcha, action])

  return { getToken }
}
