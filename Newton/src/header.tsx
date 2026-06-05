import logo from "./assets/Gemini_Generated_Image_9zc6he9zc6he9zc6.png"
function Header(){
    return(
        <header className="mainHeader">
            <img src={logo} className="imgLogo"/>
            <nav>
                <ul>

                    <li><a href="#">მთავარი</a></li>
                    <li><a href="#">რესურსები</a></li>
                    <li><a href="#">პროექტები</a></li>
                    <li><a href="#">დავალებები</a></li>
                    
                </ul>
            </nav>
        </header>
    )
}
export default Header