import { LAYOUT_CONSTANTS } from '@/constants/layout.constants'

export function Header() {
    return (
        <header className="bg-white border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-6 py-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            {LAYOUT_CONSTANTS.header.title}
                        </h1>
                        <p className="text-sm text-gray-600">
                            {LAYOUT_CONSTANTS.header.subtitle}
                        </p>
                    </div>

                    <nav className="flex space-x-6">
                        {LAYOUT_CONSTANTS.header.navigation.map((item) => (
                            <a
                                key={item.label}
                                href={item.href}
                                className="text-gray-600 hover:text-gray-900 font-medium"
                            >
                                {item.label}
                            </a>
                        ))}
                    </nav>
                </div>
            </div>
        </header>
    )
}
