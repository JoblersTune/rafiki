import { Model } from 'objection'

import { AuthServer } from '../authServer/model'
import { BaseModel } from '../../shared/baseModel'
import { AccessType, AccessAction } from 'open-payments'

export class Grant extends BaseModel {
  public static get tableName(): string {
    return 'grants'
  }

  static get virtualAttributes(): string[] {
    return ['expired', 'managementUrl']
  }

  static relationMappings = {
    authServer: {
      relation: Model.BelongsToOneRelation,
      modelClass: AuthServer,
      join: {
        from: 'grants.authServerId',
        to: 'authServers.id'
      }
    }
  }

  public authServerId!: string
  public authServer!: AuthServer
  public continueId?: string
  public continueToken?: string
  public accessToken!: string
  public managementId!: string
  public accessType!: AccessType
  public accessActions!: AccessAction[]
  public expiresAt?: Date

  public get expired(): boolean {
    return !!this.expiresAt && this.expiresAt <= new Date()
  }

  public get managementUrl(): string {
    return `${this.authServer?.url}/token/${this.managementId}`
  }
}
