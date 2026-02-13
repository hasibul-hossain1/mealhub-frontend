import { useSidebar } from '../ui/sidebar'
import Image from 'next/image'

function SidebarLogo() {
    const {open}= useSidebar()
  return (
    <div className='flex shadow-[0_4px_6px_rgba(0,0,0,0.1)] pb-1.5 justify-center'>
        <Image src="/logos/logo.png" alt='logo' width={50} height={50} unoptimized/>
       {open && <Image src="/logos/name-logo.png" alt='logo' width={150} height={0}/>}
    </div>
  )
}

export default SidebarLogo