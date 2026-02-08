'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { graphqlClient } from '@/lib/graphql-client';
import {
  GET_ACTIVE_ORDER,
  ADD_ITEM_TO_ORDER,
  ADJUST_ORDER_LINE,
  REMOVE_ORDER_LINE,
  SET_CUSTOMER_FOR_ORDER,
  SET_SHIPPING_ADDRESS,
  GET_ELIGIBLE_SHIPPING_METHODS,
  SET_SHIPPING_METHOD,
  GET_ELIGIBLE_PAYMENT_METHODS,
  TRANSITION_ORDER_TO_STATE,
  ADD_PAYMENT_TO_ORDER,
  GET_ORDER_BY_CODE,
} from '@/lib/queries/order.graphql';

const ACTIVE_ORDER_KEY = ['activeOrder'];

export function useActiveOrder() {
  return useQuery({
    queryKey: ACTIVE_ORDER_KEY,
    queryFn: async () => {
      const data: any = await graphqlClient.request(GET_ACTIVE_ORDER);
      return data.activeOrder;
    },
    staleTime: 0,
  });
}

export function useAddToCart() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ productVariantId, quantity }: { productVariantId: string; quantity: number }) => {
      const data: any = await graphqlClient.request(ADD_ITEM_TO_ORDER, {
        productVariantId,
        quantity,
      });
      return data.addItemToOrder;
    },
    onSuccess: (data) => {
      if (data && !data.errorCode) {
        queryClient.invalidateQueries({ queryKey: ACTIVE_ORDER_KEY });
      }
    },
  });
}

export function useAdjustOrderLine() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ orderLineId, quantity }: { orderLineId: string; quantity: number }) => {
      const data: any = await graphqlClient.request(ADJUST_ORDER_LINE, {
        orderLineId,
        quantity,
      });
      return data.adjustOrderLine;
    },
    onSuccess: (data) => {
      if (data && !data.errorCode) {
        queryClient.invalidateQueries({ queryKey: ACTIVE_ORDER_KEY });
      }
    },
  });
}

export function useRemoveOrderLine() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (orderLineId: string) => {
      const data: any = await graphqlClient.request(REMOVE_ORDER_LINE, {
        orderLineId,
      });
      return data.removeOrderLine;
    },
    onSuccess: (data) => {
      if (data && !data.errorCode) {
        queryClient.invalidateQueries({ queryKey: ACTIVE_ORDER_KEY });
      }
    },
  });
}

export function useSetCustomerForOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: { firstName: string; lastName: string; emailAddress: string }) => {
      const data: any = await graphqlClient.request(SET_CUSTOMER_FOR_ORDER, { input });
      return data.setCustomerForOrder;
    },
    onSuccess: (data) => {
      if (data && !data.errorCode) {
        queryClient.invalidateQueries({ queryKey: ACTIVE_ORDER_KEY });
      }
    },
  });
}

export function useSetShippingAddress() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: {
      fullName: string;
      streetLine1: string;
      streetLine2?: string;
      city: string;
      province?: string;
      postalCode: string;
      countryCode: string;
      phoneNumber?: string;
    }) => {
      const data: any = await graphqlClient.request(SET_SHIPPING_ADDRESS, { input });
      return data.setOrderShippingAddress;
    },
    onSuccess: (data) => {
      if (data && !data.errorCode) {
        queryClient.invalidateQueries({ queryKey: ACTIVE_ORDER_KEY });
      }
    },
  });
}

export function useEligibleShippingMethods() {
  return useQuery({
    queryKey: ['eligibleShippingMethods'],
    queryFn: async () => {
      const data: any = await graphqlClient.request(GET_ELIGIBLE_SHIPPING_METHODS);
      return data.eligibleShippingMethods;
    },
  });
}

export function useSetShippingMethod() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (shippingMethodId: string) => {
      const data: any = await graphqlClient.request(SET_SHIPPING_METHOD, {
        shippingMethodId: [shippingMethodId],
      });
      return data.setOrderShippingMethod;
    },
    onSuccess: (data) => {
      if (data && !data.errorCode) {
        queryClient.invalidateQueries({ queryKey: ACTIVE_ORDER_KEY });
      }
    },
  });
}

export function useEligiblePaymentMethods() {
  return useQuery({
    queryKey: ['eligiblePaymentMethods'],
    queryFn: async () => {
      const data: any = await graphqlClient.request(GET_ELIGIBLE_PAYMENT_METHODS);
      return data.eligiblePaymentMethods;
    },
  });
}

export function useTransitionOrderToState() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (state: string) => {
      const data: any = await graphqlClient.request(TRANSITION_ORDER_TO_STATE, { state });
      return data.transitionOrderToState;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ACTIVE_ORDER_KEY });
    },
  });
}

export function useAddPayment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: { method: string; metadata: Record<string, string> }) => {
      const data: any = await graphqlClient.request(ADD_PAYMENT_TO_ORDER, { input });
      return data.addPaymentToOrder;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ACTIVE_ORDER_KEY });
    },
  });
}

export function useOrderByCode(code: string) {
  return useQuery({
    queryKey: ['orderByCode', code],
    queryFn: async () => {
      const data: any = await graphqlClient.request(GET_ORDER_BY_CODE, { code });
      return data.orderByCode;
    },
    enabled: !!code,
  });
}
