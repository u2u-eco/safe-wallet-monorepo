import { selectUndeployedSafe } from '@/features/counterfactual/store/undeployedSafesSlice'
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import useSafeInfo from '@/hooks/useSafeInfo'
import { initSafeSDK, setSafeSDK } from '@/hooks/coreSDK/safeCoreSDK'
import { trackError } from '@/services/exceptions'
import ErrorCodes from '@/services/exceptions/ErrorCodes'
import { useAppDispatch, useAppSelector } from '@/store'
import { showNotification } from '@/store/notificationsSlice'
import { useWeb3ReadOnly } from '@/hooks/wallets/web3'
import { parsePrefixedAddress, sameAddress } from '@/utils/addresses'
import { asError } from '@/services/exceptions/utils'

export const useInitSafeCoreSDK = () => {
  const { safe, safeLoaded } = useSafeInfo()
  console.log("🚀 ~ useInitSafeCoreSDK ~ safeLoaded:", safeLoaded)
  const dispatch = useAppDispatch()
  const web3ReadOnly = useWeb3ReadOnly()
  console.log("🚀 ~ useInitSafeCoreSDK ~ web3ReadOnly:", web3ReadOnly)

  const { query } = useRouter()
  const prefixedAddress = Array.isArray(query.safe) ? query.safe[0] : query.safe
  const { address } = parsePrefixedAddress(prefixedAddress || '')
  console.log("🚀 ~ useInitSafeCoreSDK ~ address:", address)
  const undeployedSafe = useAppSelector((state) => selectUndeployedSafe(state, safe.chainId, address))
  console.log("🚀 ~ useEffect ~ safe.address.value):", safe.address.value)

  useEffect(() => {
    if (!safeLoaded || !web3ReadOnly || !sameAddress(address, safe.address.value)) {
      console.log("🚀 ~ useEffect ~ safeLoaded:", safeLoaded)
      // If we don't reset the SDK, a previous Safe could remain in the store
      setSafeSDK(undefined)
      return
    }

    // A read-only instance of the SDK is sufficient because we connect the signer to it when needed
    initSafeSDK({
      provider: web3ReadOnly,
      chainId: safe.chainId,
      address: safe.address.value,
      version: safe.version,
      implementationVersionState: safe.implementationVersionState,
      implementation: safe.implementation.value,
      undeployedSafe,
    })
      .then(setSafeSDK)
      .catch((_e) => {
        console.log("🚀 ~ useEffect ~ _e:", _e)
        
        const e = asError(_e)
        dispatch(
          showNotification({
            message: 'Error connecting to the blockchain. Please try reloading the page.',
            groupKey: 'core-sdk-init-error',
            variant: 'error',
            detailedMessage: e.message,
          }),
        )
        trackError(ErrorCodes._105, e.message)
      })
  }, [
    address,
    dispatch,
    safe.address.value,
    safe.chainId,
    safe.implementation.value,
    safe.implementationVersionState,
    safe.version,
    safeLoaded,
    web3ReadOnly,
    undeployedSafe,
  ])
}
