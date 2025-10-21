import { LAYOUT_CONSTANTS } from '@/constants/layout.constants'

export function Footer() {
    return (
        <footer className="bg-white border-t border-gray-200 mt-auto">
            <div className="max-w-7xl mx-auto px-6 py-6">
                <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600">
                        {LAYOUT_CONSTANTS.footer.copyright}
                    </p>

                    <div className="flex space-x-6">
                        {LAYOUT_CONSTANTS.footer.links.map((link) => (
                            <a
                                key={link.label}
                                href={link.href}
                                className="text-sm text-gray-600 hover:text-gray-900"
                            >
                                {link.label}
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    )
}
