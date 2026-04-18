interface positionProps {
  position: string;
}

const HeaderLogo = ({ position }: positionProps) => {
  return (
    <div className="flex items-center gap-2.5 cursor-pointer">
      <img src="/img/gsgLogo.png" alt="GSG logo" width={50} height={50} />
      <h1
        className={`text-xl font-bold  ${
          position === "absolute" ? "lg:text-white" : "lg:text-black"
        }`}
      >
        Gaza Sky Geeks
      </h1>
    </div>
  );
};

export default HeaderLogo;
