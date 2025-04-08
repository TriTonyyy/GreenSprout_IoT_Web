export const getLang = async () => {
    try {
      const jsonValue = await localStorage.getItem("lang");
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
      // error reading value
    }
  };
  
export const setLang = async (lang) =>
    await localStorage.setItem("lang", JSON.stringify(lang));
  

  