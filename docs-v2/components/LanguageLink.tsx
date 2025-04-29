import React from "react";

type LanguageLinkProps = {
  icon: string;
  name: string;
  link: string;
};

function LanguageLink({
  icon, name, link,
}: LanguageLinkProps) {
  return (
    <div className="flex justify-center items-center">
      <a href={link}>
        <img alt={name} src={icon} width="100" />
      </a>
    </div>
  );
}

export default LanguageLink;
