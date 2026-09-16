import createAxiosInstance from '../../config/AxiosVindi';

interface IResponse {
  subscription: {
    id: number;
    status: string;
    start_at: string;
    end_at: string;
    next_billing_at: string;
    overdue_since: string;
    code: string;
    cancel_at: string;
    interval: string;
    interval_count: number;
    billing_trigger_type: string;
    billing_trigger_day: number;
    billing_cycles: string;
    installments: number;
    created_at: string;
    updated_at: string;
    customer: {
      id: number;
      name: string;
      email: string;
      code: string;
    };
    plan: {
      id: number;
      name: string;
      code: string;
    };
    product_items: [
      {
        id: number;
        status: string;
        uses: number;
        cycles: string;
        quantity: number;
        created_at: string;
        updated_at: string;
        product: {
          id: number;
          name: string;
          code: string;
        };
        pricing_schema: {
          id: number;
          short_format: string;
          price: string;
          minimum_price: string;
          schema_type: string;
          pricing_ranges: [];
          created_at: string;
        };
        discounts: [];
      },
    ];
    payment_method: {
      id: number;
      public_name: string;
      name: string;
      code: string;
      type: string;
    };
    current_period: {
      id: number;
      billing_at: string;
      cycle: number;
      start_at: string;
      end_at: string;
      duration: number;
    };
    metadata: unknown;
    payment_profile: {
      id: number;
      holder_name: string;
      registry_code: string;
      bank_branch: string;
      bank_account: string;
      card_expiration: string;
      allow_as_fallback: string;
      card_number_first_six: string;
      card_number_last_four: string;
      renewed_card: {
        card_number_last_four: string;
        card_expiration: string;
      };
      card_renewed_at: string;
      token: string;
      created_at: string;
      payment_company: {
        id: number;
        name: string;
        code: string;
      };
    };
    invoice_split: boolean;
  };
  errors?: [
    {
      id: string;
      message: string;
    },
  ];
}

export default class FindSubscriptionService {
  public async execute(subscriptionId: number): Promise<IResponse> {
    const vindiURL = process.env.VINDI_URL;
    console.log(vindiURL);

    const httpClient = createAxiosInstance(vindiURL || 'https://app.vindi.com.br/api/v1');

    const response = await httpClient.get(`/subscriptions/${subscriptionId}`);

    return response.data;
  }
}
