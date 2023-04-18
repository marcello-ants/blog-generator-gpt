import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBrain } from "@fortawesome/free-solid-svg-icons";

const Logo = () => {
  return (
    <div className="text-center text-3xl font-heading py-4">
      Blogify AI
      <FontAwesomeIcon
        icon={faBrain}
        className="text-slate-400 text-3xl pl-3"
      />
    </div>
  );
};

export default Logo;
