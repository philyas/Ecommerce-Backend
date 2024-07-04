export class CreateOrderItemDto {
    readonly orderId: number;
    readonly productId: number;
    readonly quantity: number;
    readonly price: number;
  }
  