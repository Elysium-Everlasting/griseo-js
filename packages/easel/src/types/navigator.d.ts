/**
 * Inject {@link Navigator.userAgentData} into the global {@link Navigator}.
 * @see https://github.com/lukewarlow/user-agent-data-types/blob/master/index.d.ts
 */

/**
 * @see WICG Spec: https://wicg.github.io/ua-client-hints
 */
declare interface Navigator extends NavigatorUA {}

declare interface WorkerNavigator extends NavigatorUA {}

/**
 * @see https://wicg.github.io/ua-client-hints/#navigatorua
 */
declare interface NavigatorUA {
  readonly userAgentData?: NavigatorUAData
}

/**
 * @see https://wicg.github.io/ua-client-hints/#dictdef-navigatoruabrandversion
 */
interface NavigatorUABrandVersion {
  readonly brand: string
  readonly version: string
}

/**
 * @see https://wicg.github.io/ua-client-hints/#dictdef-uadatavalues
 */
interface UADataValues {
  readonly brands?: NavigatorUABrandVersion[]
  readonly mobile?: boolean
  readonly platform?: string
  readonly architecture?: string
  readonly bitness?: string
  readonly model?: string
  readonly platformVersion?: string

  /**
   * @deprecated in favour of {@link fullVersionList}
   */
  readonly uaFullVersion?: string
  readonly fullVersionList?: NavigatorUABrandVersion[]
  readonly wow64?: boolean
}

/**
 * @see https://wicg.github.io/ua-client-hints/#dictdef-ualowentropyjson
 */
interface UALowEntropyJSON {
  readonly brands: NavigatorUABrandVersion[]
  readonly mobile: boolean
  readonly platform: string
}

/**
 * @see https://wicg.github.io/ua-client-hints/#navigatoruadata
 */
interface NavigatorUAData extends UALowEntropyJSON {
  getHighEntropyValues(hints: string[]): Promise<UADataValues>
  toJSON(): UALowEntropyJSON
}
