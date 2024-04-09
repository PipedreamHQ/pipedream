import React from "react";

function LanguageLink({
  icon, name, link,
}) {
  return (
    <div className="flex justify-center items-center">
      <a href={link}>
        <img alt={name} src={icon} width="100" />
      </a>
    </div>
  );
}

export default LanguageLink;
