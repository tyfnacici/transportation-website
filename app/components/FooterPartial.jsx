import Image from "next/image"
import Link from "next/link"
import logo from "../../public/assets/images/logo.png"

const Footer = () => {
  return (
    <>
      <div>
        <Link href="/dashboard">
          <Image src={logo} width={270} alt="apple" />
        </Link>
        <p className="mt-[24px] opacity-50 ">
          transportation 2024<br></br>Tüm hakları saklıdır
        </p>
      </div>
      <div className="flex flex-col md:flex-row justify-between lg:space-x-[220px] md:space-x-[5rem] space-y-12 md:space-y-0">
        <ul className="flex flex-col lg:space-y-4 space-y-2">
          <li>
            <Link className="opacity-50 " href="/hakkimizda">
              Hakkımızda
            </Link>
          </li>
          <li>
            <Link href="/hakkimizda/gizlilik_sozlesmesi">
              Gizlilik Sözleşmesi
            </Link>
          </li>
          <li>
            <Link href="/hakkimizda/mesafeli_satis_sozlesmesi">
              Mesafeli Satış Sözleşmesi
            </Link>
          </li>
          <li>
            <Link href="/hakkimizda/teslimat_ve_iade_sartlari">
              Teslimat ve İade Şartları
            </Link>
          </li>
          <li>
            <Link href="/hakkimizda/kullanici_sozlesmesi">
              Kullanıcı Sözleşmesi
            </Link>
          </li>
          <li>
            <Link href="mailto:someone@yoursite.com">Bize Ulaşın</Link>
          </li>
        </ul>
        <ul className="flex items-start flex-col lg:space-y-4 space-y-2">
          <li>
            <Link className="opacity-50 " href="#">
              Sosyal Medya
            </Link>
          </li>
          <li>
            <Link href="https://www.instagram.com/transportationofficial/">
              Instagram
            </Link>
          </li>
          <li>
            <Link href="#">Twitter</Link>
          </li>
          <li>
            <Link href="#">Linkedin</Link>
          </li>
        </ul>
        <ul className="flex items-start flex-col lg:space-y-4 space-y-2 md:mr-4">
          <li>
            <Link className="opacity-50 " href="#">
              Şimdi Yükle
            </Link>
          </li>
          <li>
            <Link href="#">Google Play</Link>
          </li>
          <li>
            <Link href="#">App Store</Link>
          </li>
        </ul>
      </div>
    </>
  )
}

export default Footer
