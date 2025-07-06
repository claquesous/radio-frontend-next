import Link from "next/link"

export default function BackButton({ href }: { href: string }) {
  return (
    <Link href={href} className="flex items-center gap-1 px-2 py-1 rounded bg-gray-200 hover:bg-gray-300 text-gray-700">
      <svg viewBox="0 0 16 16" fill="#000000" xmlns="http://www.w3.org/2000/svg" id="Corner-Down-Left-Fill--Streamline-Remix-Fill" height="16" width="16">
        <desc>
          Corner Down Left Fill Streamline Icon: https://streamlinehq.com
        </desc>
        <path d="M12.666733333333333 9.333266666666667 12.666799999999999 3.333333333333333l-1.3333333333333333 -0.00002 -0.00006666666666666667 4.66662 -5.057366666666667 0V4.3905199999999995L1.9998999999999998 8.666666666666666l4.276133333333333 4.276133333333333 0.00000666666666666667 -3.6095333333333333 6.390693333333333 0Z" strokeWidth="0.6667"></path>
      </svg>
      Back
    </Link>
  )
}
