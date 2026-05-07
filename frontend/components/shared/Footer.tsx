import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200/50 py-12 mt-16">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-primary-600">CityCare</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              منصة رائدة لخدمات المنزل والصيانة، تربطك بأفضل الفنيين المحليين.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">روابط سريعة</h4>
            <ul className="space-y-2">
              <li><Link href="/" className="text-gray-600 hover:text-primary-600 text-sm transition-colors">الرئيسية</Link></li>
              <li><Link href="/services" className="text-gray-600 hover:text-primary-600 text-sm transition-colors">الخدمات</Link></li>
              <li><Link href="/auth/register" className="text-gray-600 hover:text-primary-600 text-sm transition-colors">إنشاء حساب</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">خدماتنا</h4>
            <ul className="space-y-2">
              <li className="text-gray-600 text-sm">صيانة المنزل</li>
              <li className="text-gray-600 text-sm">التصليحات الكهربائية</li>
              <li className="text-gray-600 text-sm">السباكة</li>
              <li className="text-gray-600 text-sm">التكييف</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">تواصل معنا</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>📞 123-456-789</li>
              <li>✉️ info@citycare.com</li>
              <li>📍 القاهرة، مصر</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} CityCare. جميع الحقوق محفوظة.
        </div>
      </div>
    </footer>
  );
}
