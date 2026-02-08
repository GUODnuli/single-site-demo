import { bootstrap, defaultShippingCalculator, defaultShippingEligibilityChecker, LanguageCode } from '@vendure/core';
import { config } from './vendure-config';

async function seed() {
  const app = await bootstrap(config);

  const { GraphQLClient } = await import('graphql-request');
  const client = new GraphQLClient('http://localhost:3000/admin-api', {
    headers: { 'Content-Type': 'application/json' },
  });

  // Authenticate as superadmin
  const loginResult: any = await client.request(`
    mutation {
      login(username: "${process.env.SUPERADMIN_USERNAME || 'superadmin'}", password: "${process.env.SUPERADMIN_PASSWORD || 'superadmin'}") {
        ... on CurrentUser {
          id
          identifier
        }
        ... on InvalidCredentialsError {
          message
        }
      }
    }
  `);
  console.log('Login result:', loginResult.login);

  // Get the auth token from response headers
  const authToken = (client as any).requestConfig?.headers?.['vendure-token'];

  // Create Shipping Method
  try {
    const shippingResult: any = await client.request(`
      mutation {
        createShippingMethod(input: {
          code: "standard-shipping"
          translations: [
            {
              languageCode: en
              name: "Standard Shipping"
              description: "Standard delivery within 5-7 business days"
            }
            {
              languageCode: zh
              name: "标准配送"
              description: "5-7个工作日内送达"
            }
          ]
          fulfillmentHandler: "manual-fulfillment"
          checker: {
            code: "default-shipping-eligibility-checker"
            arguments: [{ name: "orderMinimum", value: "0" }]
          }
          calculator: {
            code: "default-shipping-calculator"
            arguments: [
              { name: "rate", value: "599" }
              { name: "includesTax", value: "false" }
              { name: "taxRate", value: "0" }
            ]
          }
        }) {
          id
          name
          code
        }
      }
    `);
    console.log('Shipping method created:', shippingResult.createShippingMethod);
  } catch (e: any) {
    console.log('Shipping method may already exist:', e.message?.substring(0, 100));
  }

  // Create Payment Method
  try {
    const paymentResult: any = await client.request(`
      mutation {
        createPaymentMethod(input: {
          code: "demo-payment"
          enabled: true
          translations: [
            {
              languageCode: en
              name: "Demo Payment"
              description: "Demo payment method - no real charges"
            }
            {
              languageCode: zh
              name: "演示支付"
              description: "演示支付方式 - 不会产生真实扣款"
            }
          ]
          handler: {
            code: "dummy-payment-handler"
            arguments: [
              { name: "automaticSettle", value: "true" }
            ]
          }
        }) {
          id
          name
          code
        }
      }
    `);
    console.log('Payment method created:', paymentResult.createPaymentMethod);
  } catch (e: any) {
    console.log('Payment method may already exist:', e.message?.substring(0, 100));
  }

  // Create demo products
  const products = [
    {
      name: 'Velvet Blackout Curtain',
      slug: 'velvet-blackout-curtain',
      description: 'Luxurious velvet curtains with complete blackout functionality. Perfect for bedrooms and media rooms. Features triple-weave blackout lining for 99%+ light blocking.',
      variants: [
        { name: 'Navy Blue - 52"x84"', sku: 'VBC-NB-5284', price: 8999 },
        { name: 'Charcoal Gray - 52"x84"', sku: 'VBC-CG-5284', price: 8999 },
        { name: 'Burgundy - 52"x84"', sku: 'VBC-BG-5284', price: 9499 },
      ],
      customFields: {
        material: 'Premium Velvet',
        style: 'Modern Luxury',
        applicationScenes: ['Bedroom', 'Living Room', 'Media Room'],
        isNew: true,
        isFeatured: true,
      },
    },
    {
      name: 'Sheer Linen Curtain',
      slug: 'sheer-linen-curtain',
      description: 'Light and airy sheer linen curtains that filter natural light beautifully. Ideal for living rooms and dining areas where you want soft, diffused light.',
      variants: [
        { name: 'White - 52"x84"', sku: 'SLC-WH-5284', price: 4999 },
        { name: 'Ivory - 52"x84"', sku: 'SLC-IV-5284', price: 4999 },
        { name: 'Light Gray - 52"x96"', sku: 'SLC-LG-5296', price: 5999 },
      ],
      customFields: {
        material: 'Natural Linen',
        style: 'Minimalist',
        applicationScenes: ['Living Room', 'Dining Room', 'Sunroom'],
        isNew: false,
        isFeatured: true,
      },
    },
    {
      name: 'Silk Drape Collection',
      slug: 'silk-drape-collection',
      description: 'Elegant silk drapes with a lustrous sheen. Hand-finished with pinch pleat headers for a sophisticated look in formal spaces.',
      variants: [
        { name: 'Champagne Gold - 52"x96"', sku: 'SDC-CG-5296', price: 15999 },
        { name: 'Silver - 52"x96"', sku: 'SDC-SV-5296', price: 15999 },
        { name: 'Emerald Green - 52"x96"', sku: 'SDC-EG-5296', price: 16999 },
      ],
      customFields: {
        material: 'Pure Silk',
        style: 'Classic Elegance',
        applicationScenes: ['Formal Living Room', 'Master Bedroom', 'Hotel Suite'],
        isNew: true,
        isFeatured: false,
      },
    },
    {
      name: 'Thermal Insulated Curtain',
      slug: 'thermal-insulated-curtain',
      description: 'Energy-efficient thermal insulated curtains that help reduce heating and cooling costs. Features a thermal backing that blocks drafts and UV rays.',
      variants: [
        { name: 'Beige - 52"x84"', sku: 'TIC-BG-5284', price: 6999 },
        { name: 'Dark Gray - 52"x84"', sku: 'TIC-DG-5284', price: 6999 },
        { name: 'Navy - 52"x96"', sku: 'TIC-NV-5296', price: 7999 },
      ],
      customFields: {
        material: 'Polyester with Thermal Backing',
        style: 'Contemporary',
        applicationScenes: ['Bedroom', 'Living Room', 'Office'],
        isNew: false,
        isFeatured: true,
      },
    },
    {
      name: 'Roman Shade - Linen Blend',
      slug: 'roman-shade-linen-blend',
      description: 'Classic Roman shades crafted from a premium linen blend. Clean, modern lines when raised and elegant folds when lowered.',
      variants: [
        { name: 'Natural - 36"x72"', sku: 'RSL-NT-3672', price: 11999 },
        { name: 'Oatmeal - 48"x72"', sku: 'RSL-OT-4872', price: 13999 },
        { name: 'Slate Blue - 36"x72"', sku: 'RSL-SB-3672', price: 12999 },
      ],
      customFields: {
        material: 'Linen Blend',
        style: 'Classic',
        applicationScenes: ['Kitchen', 'Bathroom', 'Study'],
        isNew: true,
        isFeatured: false,
      },
    },
    {
      name: 'Motorized Smart Curtain',
      slug: 'motorized-smart-curtain',
      description: 'Smart motorized curtains compatible with Alexa, Google Home, and Apple HomeKit. Schedule opening/closing times and control remotely via app.',
      variants: [
        { name: 'White - 52"x84" (Motor Included)', sku: 'MSC-WH-5284', price: 24999 },
        { name: 'Gray - 52"x84" (Motor Included)', sku: 'MSC-GR-5284', price: 24999 },
        { name: 'Black - 52"x96" (Motor Included)', sku: 'MSC-BK-5296', price: 27999 },
      ],
      customFields: {
        material: 'Smart Fabric',
        style: 'Smart Home',
        applicationScenes: ['Smart Home', 'Bedroom', 'Living Room', 'Office'],
        isNew: true,
        isFeatured: true,
      },
    },
  ];

  for (const product of products) {
    try {
      // Create product
      const createResult: any = await client.request(`
        mutation CreateProduct($input: CreateProductInput!) {
          createProduct(input: $input) {
            id
            name
            slug
          }
        }
      `, {
        input: {
          translations: [
            {
              languageCode: 'en',
              name: product.name,
              slug: product.slug,
              description: product.description,
              customFields: {
                material: product.customFields.material,
                style: product.customFields.style,
              },
            },
          ],
          customFields: {
            applicationScenes: product.customFields.applicationScenes,
            isNew: product.customFields.isNew,
            isFeatured: product.customFields.isFeatured,
          },
        },
      });

      const productId = createResult.createProduct.id;
      console.log(`Product created: ${product.name} (ID: ${productId})`);

      // Create variants
      for (const variant of product.variants) {
        const variantResult: any = await client.request(`
          mutation CreateProductVariants($input: [CreateProductVariantInput!]!) {
            createProductVariants(input: $input) {
              id
              name
              sku
            }
          }
        `, {
          input: [{
            productId,
            translations: [
              {
                languageCode: 'en',
                name: variant.name,
              },
            ],
            sku: variant.sku,
            price: variant.price,
            stockOnHand: 100,
            trackInventory: false,
          }],
        });
        console.log(`  Variant created: ${variant.name}`);
      }
    } catch (e: any) {
      console.log(`Product "${product.name}" may already exist:`, e.message?.substring(0, 100));
    }
  }

  // Create collections
  const collections = [
    { name: 'Blackout Curtains', slug: 'blackout-curtains', description: 'Complete darkness for restful sleep' },
    { name: 'Sheer Curtains', slug: 'sheer-curtains', description: 'Light filtering for soft ambiance' },
    { name: 'Luxury Collection', slug: 'luxury-collection', description: 'Premium materials for elegant spaces' },
    { name: 'Smart Home', slug: 'smart-home', description: 'Technology-integrated window treatments' },
  ];

  for (const collection of collections) {
    try {
      const result: any = await client.request(`
        mutation {
          createCollection(input: {
            translations: [
              {
                languageCode: en
                name: "${collection.name}"
                slug: "${collection.slug}"
                description: "${collection.description}"
              }
            ]
            filters: []
          }) {
            id
            name
            slug
          }
        }
      `);
      console.log(`Collection created: ${collection.name}`);
    } catch (e: any) {
      console.log(`Collection "${collection.name}" may already exist:`, e.message?.substring(0, 100));
    }
  }

  console.log('\n✓ Seed data complete!');
  console.log('Next steps:');
  console.log('  1. Open Admin UI at http://localhost:3000/admin');
  console.log('  2. Upload product images for each product');
  console.log('  3. Assign products to collections');
  console.log('  4. Verify shipping and payment methods are enabled');

  await app.close();
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seed error:', err);
  process.exit(1);
});
