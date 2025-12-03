import { motion } from "framer-motion";
import { Card, CardContent } from "./ui/card";
import streetLightImage from "../assets/street_light.jpeg";
import streetSweeperImage from "../assets/sweepers.jpeg";
import EVImage from "../assets/EV.jpeg";
import { Link } from "react-router";

const ShopSection = () => {
    const products = [
        {
            title: "Solar Panels",
            description:
                "High-efficiency solar panels for residential and commercial use, ensuring maximum energy generation.",
            image:
                "https://lh3.googleusercontent.com/aida-public/AB6AXuB2nv-EXQv08cCDQY2OcfLfmoIj7Wm8iNMMx0TzwjZYQ6iICxgAY1lUnlZBvf0Bi7oasyw6l-eC1x2iTpzjHqk1yA6rHBRsCOe-X7EnUrwuf71BnGTNohSfXpAnePNky9lNgdE4oTAJPUNsCGe7Ko8UH4xgsWfeNqKsdHZnuwltlR-UYImMvJa8_X7rTSV_r66QM6kuI5K-KSmdMeqbIwBIMi2cfA_6kBBzh6stYRawie-SqAikaWt2hhlBXJF1HyeH8TVjVkcX1y-7",
        },
        {
            title: "Street Lights",
            description:
                "Durable and efficient street lights designed to perform reliably in various environments.",
            image: streetLightImage,
        },
        {
            title: "Street Sweepers",
            description:
                "Advanced energy storage solutions to maximize your use of renewable energy, day and night.",
            image: streetSweeperImage,
        },
        {
            title: "Electric Vehicle",
            description:
                "Wholesale supply of EVs for commercial and personal use, promoting sustainable transportation solutions.",
            image: EVImage,
        },
    ];

    return (
        <main id="shop" className="flex-grow container mx-auto px-6 py-12">
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                    Our Shop
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                    Explore our cutting-edge range of solar and renewable energy
                    solutions, engineered for superior performance and a sustainable
                    future.
                </p>
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 items-stretch">
                {products.map((product, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: index * 0.15 }}
                        className="h-full"
                    >
                        <Card className="flex flex-col h-full bg-background-light/50 dark:bg-background-dark/50 rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                            <div className="relative">
                                <div
                                    className="w-full aspect-square bg-cover bg-center"
                                    style={{ backgroundImage: `url(${product.image})` }}
                                />
                                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>
                            </div>

                            <CardContent className="p-6 flex flex-col flex-grow justify-between">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                                        {product.title}
                                    </h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        {product.description}
                                    </p>
                                </div>
                                <Link
                                    to="/shop"
                                    className="inline-block mt-4 text-sm font-bold text-primary hover:underline"
                                >
                                    Learn More →
                                </Link>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>
        </main>
    )
}

export default ShopSection