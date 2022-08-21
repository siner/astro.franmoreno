import Stars from "./stars";
import { motion } from "framer-motion";

function Devicon({ name, stars }) {
  const iconMotion = {
    rest: {
      y: 0,
      transition: {
        duration: 0.4,
        type: "tween",
        ease: "easeIn",
      },
    },
    hover: {
      y: -30,
      transition: {
        duration: 0.4,
        type: "tween",
        ease: "easeOut",
      },
    },
  };

  const starsMotion = {
    rest: { opacity: 0, ease: "easeOut", duration: 0.2, type: "tween" },
    hover: {
      opacity: 1,
      transition: {
        duration: 0.4,
        type: "tween",
        ease: "easeIn",
      },
    },
  };

  return (
    <motion.div
      className="iconcontainer mt-5 md:hover:text-orange"
      initial="rest"
      whileHover="hover"
      animate="rest">
      <motion.div className="starscontainer" variants={starsMotion}>
        <Stars number={stars} />
      </motion.div>

      <motion.div variants={iconMotion}>
        <i className={`devicon ${name} `}></i>
      </motion.div>
    </motion.div>
  );
}
export default Devicon;
