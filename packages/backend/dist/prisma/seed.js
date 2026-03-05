"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('🌱 Starting database seeding...');
    await prisma.purchase.deleteMany();
    await prisma.asset.deleteMany();
    await prisma.user.deleteMany();
    console.log('🧹 Cleared existing data');
    const users = [
        {
            email: 'john.doe@example.com',
            name: 'John Doe',
            role: client_1.UserRole.CUSTOMER,
            auth0Id: 'auth0|john123',
        },
        {
            email: 'jane.smith@example.com',
            name: 'Jane Smith',
            role: client_1.UserRole.SELLER,
            auth0Id: 'auth0|jane456',
        },
        {
            email: 'admin@prosets.com',
            name: 'Admin User',
            role: client_1.UserRole.ADMIN,
            auth0Id: 'auth0|admin789',
        },
        {
            email: 'mike.wilson@example.com',
            name: 'Mike Wilson',
            role: client_1.UserRole.SELLER,
            auth0Id: 'auth0|mike012',
        },
        {
            email: 'sarah.jones@example.com',
            name: 'Sarah Jones',
            role: client_1.UserRole.CUSTOMER,
            auth0Id: 'auth0|sarah345',
        },
    ];
    const createdUsers = [];
    for (const userData of users) {
        const user = await prisma.user.create({
            data: userData,
        });
        createdUsers.push(user);
        console.log(`👤 Created user: ${user.name} (${user.email})`);
    }
    const assets = [
        {
            title: 'Premium UI Kit - Modern Dashboard',
            description: 'A comprehensive UI kit for modern dashboard applications with over 100 components, dark mode support, and fully responsive design.',
            price: 49.99,
            category: client_1.AssetCategory.OTHER,
            status: client_1.AssetStatus.ACTIVE,
            sellerId: createdUsers[1].id,
            sourceFileUrl: 'https://example.com/files/ui-kit.zip',
            sourceFileName: 'ui-kit.zip',
            sourceFileSize: 1024000,
            previewImageUrl: 'https://example.com/previews/ui-kit.png',
            tags: ['dashboard', 'ui', 'modern', 'responsive'],
        },
        {
            title: 'React Native E-commerce Template',
            description: 'Complete e-commerce mobile app template built with React Native, includes product listings, cart, checkout, and payment integration.',
            price: 79.99,
            category: client_1.AssetCategory.CODE_SNIPPET,
            status: client_1.AssetStatus.ACTIVE,
            sellerId: createdUsers[1].id,
            sourceFileUrl: 'https://example.com/files/react-native-ecom.zip',
            sourceFileName: 'react-native-ecom.zip',
            sourceFileSize: 2048000,
            previewImageUrl: 'https://example.com/previews/ecom-mobile.png',
            tags: ['react-native', 'ecommerce', 'mobile', 'template'],
        },
        {
            title: 'Vue.js Admin Dashboard',
            description: 'Professional admin dashboard built with Vue.js 3, Composition API, and Tailwind CSS. Includes charts, tables, and authentication.',
            price: 39.99,
            category: client_1.AssetCategory.CODE_SNIPPET,
            status: client_1.AssetStatus.ACTIVE,
            sellerId: createdUsers[3].id,
            sourceFileUrl: 'https://example.com/files/vue-admin.zip',
            sourceFileName: 'vue-admin.zip',
            sourceFileSize: 1536000,
            previewImageUrl: 'https://example.com/previews/vue-admin.png',
            tags: ['vue', 'admin', 'dashboard', 'tailwind'],
        },
        {
            title: 'Figma Design System',
            description: 'Complete design system with components, patterns, and guidelines for consistent design across your products.',
            price: 29.99,
            category: client_1.AssetCategory.OTHER,
            status: client_1.AssetStatus.ACTIVE,
            sellerId: createdUsers[3].id,
            sourceFileUrl: 'https://example.com/files/figma-design-system.fig',
            sourceFileName: 'figma-design-system.fig',
            sourceFileSize: 512000,
            previewImageUrl: 'https://example.com/previews/design-system.png',
            tags: ['figma', 'design-system', 'ui', 'components'],
        },
        {
            title: 'Next.js Blog Template',
            description: 'SEO-optimized blog template built with Next.js 14, featuring MDX support, dark mode, and responsive design.',
            price: 34.99,
            category: client_1.AssetCategory.CODE_SNIPPET,
            status: client_1.AssetStatus.ACTIVE,
            sellerId: createdUsers[1].id,
            sourceFileUrl: 'https://example.com/files/nextjs-blog.zip',
            sourceFileName: 'nextjs-blog.zip',
            sourceFileSize: 1280000,
            previewImageUrl: 'https://example.com/previews/blog-template.png',
            tags: ['nextjs', 'blog', 'seo', 'mdx'],
        },
        {
            title: 'iOS App Icons Pack',
            description: 'Collection of 100+ high-quality app icons in various sizes and formats, perfect for iOS applications.',
            price: 19.99,
            category: client_1.AssetCategory.OTHER,
            status: client_1.AssetStatus.ACTIVE,
            sellerId: createdUsers[3].id,
            sourceFileUrl: 'https://example.com/files/ios-icons.zip',
            sourceFileName: 'ios-icons.zip',
            sourceFileSize: 768000,
            previewImageUrl: 'https://example.com/previews/icons-pack.png',
            tags: ['icons', 'ios', 'mobile', 'ui'],
        },
        {
            title: 'Flutter Social Media App',
            description: 'Full-featured social media app template with posts, comments, likes, and real-time chat functionality.',
            price: 89.99,
            category: client_1.AssetCategory.CODE_SNIPPET,
            status: client_1.AssetStatus.ACTIVE,
            sellerId: createdUsers[3].id,
            sourceFileUrl: 'https://example.com/files/flutter-social.zip',
            sourceFileName: 'flutter-social.zip',
            sourceFileSize: 2560000,
            previewImageUrl: 'https://example.com/previews/social-app.png',
            tags: ['flutter', 'social', 'chat', 'mobile'],
        },
        {
            title: 'Tailwind CSS Component Library',
            description: 'Extensive component library with 50+ pre-built components using Tailwind CSS, fully customizable and responsive.',
            price: 24.99,
            category: client_1.AssetCategory.CODE_SNIPPET,
            status: client_1.AssetStatus.ACTIVE,
            sellerId: createdUsers[1].id,
            sourceFileUrl: 'https://example.com/files/tailwind-components.zip',
            sourceFileName: 'tailwind-components.zip',
            sourceFileSize: 896000,
            previewImageUrl: 'https://example.com/previews/tailwind-components.png',
            tags: ['tailwind', 'components', 'css', 'responsive'],
        },
    ];
    const createdAssets = [];
    for (const assetData of assets) {
        const asset = await prisma.asset.create({
            data: assetData,
        });
        createdAssets.push(asset);
        console.log(`📦 Created asset: ${asset.title}`);
    }
    const purchases = [
        {
            buyerId: createdUsers[0].id,
            assetId: createdAssets[0].id,
            status: client_1.PurchaseStatus.PAID,
            amount: createdAssets[0].price,
        },
        {
            buyerId: createdUsers[0].id,
            assetId: createdAssets[3].id,
            status: client_1.PurchaseStatus.PAID,
            amount: createdAssets[3].price,
        },
        {
            buyerId: createdUsers[4].id,
            assetId: createdAssets[1].id,
            status: client_1.PurchaseStatus.PAID,
            amount: createdAssets[1].price,
        },
        {
            buyerId: createdUsers[4].id,
            assetId: createdAssets[4].id,
            status: client_1.PurchaseStatus.PENDING,
            amount: createdAssets[4].price,
        },
        {
            buyerId: createdUsers[0].id,
            assetId: createdAssets[5].id,
            status: client_1.PurchaseStatus.PAID,
            amount: createdAssets[5].price,
        },
    ];
    for (const purchaseData of purchases) {
        const purchase = await prisma.purchase.create({
            data: purchaseData,
        });
        console.log(`💳 Created purchase: ${purchase.buyerId} -> ${purchase.assetId}`);
    }
    console.log('\n✅ Database seeding completed successfully!');
    console.log(`📊 Summary:`);
    console.log(`   - Users: ${createdUsers.length}`);
    console.log(`   - Assets: ${createdAssets.length}`);
    console.log(`   - Purchases: ${purchases.length}`);
}
main()
    .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map