import {BaseEntity} from '../../../shared/domain/model/base-entity';

export class User implements BaseEntity {
  get reservedAt(): null {
    return this.#reservedAt;
  }

  set reservedAt(value: null) {
    this.#reservedAt = value;
  }
  get weatherTemperature(): number {
    return this.#weatherTemperature;
  }

  set weatherTemperature(value: number) {
    this.#weatherTemperature = value;
  }
  get participants(): number {
    return this.#participants;
  }

  set participants(value: number) {
    this.#participants = value;
  }


  #id: number;
  #participantName: string;
  #outdoorCenterId: number;
  // @ts-ignore
  #activityType: string;
  #participants:number;
  #weatherTemperature:number;
  #reservedAt:null;

  constructor(props: { id: number; outdoorCenterId:number; activityType: string ; participantName:string; participants: number;
    weatherTemperature:number; reservedAt: null }) {
    this.#id = props.id;
    this.#outdoorCenterId = props.outdoorCenterId;
    this.activityType = props.activityType;
    this.#participantName = props.participantName;
    this.#participants = props.participants;
    this.#weatherTemperature = props.weatherTemperature;
    this.#reservedAt = props.reservedAt;

  }

  get id(): number {
    return this.#id;
  }

  set id(value: number) {
    this.#id = value;
  }

  get participantName(): string {
    return this.#participantName;
  }


  set participantName(value: string) {
    this.#participantName = value;
  }

  get activityType(): string {
    return this.#activityType;
  }

  set activityType(value: string) {
    this.#activityType = value;
  }
  get outdoorCenterId(): number {
    return this.#outdoorCenterId;
  }

  set outdoorCenterId(value: number) {
    this.#outdoorCenterId = value;
  }
}
