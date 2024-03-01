import { LightningElement, api } from "lwc";

export default class RecipeBadge extends LightningElement {
  @api title;
  @api isTrue;
}