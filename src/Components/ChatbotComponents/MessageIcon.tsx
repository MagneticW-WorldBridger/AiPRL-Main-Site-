import Logo from '../../assets/AiprlLogo.svg'

interface MessageIconProps {
  onClick: () => void
  isPopupVisible: boolean
}

function MessageIcon({ onClick, isPopupVisible }: MessageIconProps) {
  return (
    <div
      className={`fixed lg:bottom-8 bottom-2 lg:right-8 right-2 p-8 z-50 cursor-pointer transition-all duration-700 ${
        isPopupVisible ? '' : 'animate-pulse hover:scale-110'
      }`}
      onClick={onClick}
    >
      <div className="absolute lg:scale-auto scale-80 inset-0 bg-white rounded-full shadow-lg"></div>
      <div className="absolute inset-2 transform lg:scale-125 scale-75 flex items-center justify-center">
        <img
          src={Logo}
          alt="Message Icon"
          className="w-auto lg:scale-75 object-contain drop-shadow-2xl shadow-black"
        />
      </div>
    </div>
  )
}

export default MessageIcon