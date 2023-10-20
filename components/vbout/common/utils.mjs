export const parseChannelOptions = ({ channels }) => {
  const options = [];
  if (channels.Facebook.pages.length) {
    for (const page of channels.Facebook.pages) {
      options.push({
        label: `Facebook - ${page.name}`,
        value: page.id,
      });
    }
  }
  if (channels.Twitter.profiles.length) {
    for (const profile of channels.Twitter.profiles) {
      options.push({
        label: `Twitter - ${profile.name}`,
        value: profile.id,
      });
    }
  }
  if (channels.Linkedin.profiles.length) {
    for (const profile of channels.Linkedin.profiles) {
      options.push({
        label: `Linkedin - ${profile.name}`,
        value: profile.id,
      });
    }
  }
  if (channels.Pinterest.profiles.length) {
    for (const profile of channels.Pinterest.profiles) {
      options.push({
        label: `Pinterest - ${profile.name}`,
        value: profile.id,
      });
    }
  }
  if (channels.Pinterest.boards.length) {
    for (const board of channels.Pinterest.boards) {
      options.push({
        label: `Pinterest - ${board.name}`,
        value: board.id,
      });
    }
  }
  if (channels.Instagram.profiles.length) {
    for (const profile of channels.Instagram.profiles) {
      options.push({
        label: `Instagram - ${profile.name}`,
        value: profile.id,
      });
    }
  }

  return options;
};
