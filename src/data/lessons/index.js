import mod1 from "./module-01-lessons.json";
import mod2 from "./module-02-lessons.json";
import mod3 from "./module-03-lessons.json";
import mod4 from "./module-04-lessons.json";
import mod5 from "./module-05-lessons.json";
import mod6 from "./module-06-lessons.json";
import mod7 from "./module-07-lessons.json";
import mod8 from "./module-08-lessons.json";

export const lessonModules = [mod1, mod2, mod3, mod4, mod5, mod6, mod7, mod8];

export const lessonMap = {};
lessonModules.forEach((m) => {
  m.lessons.forEach((l) => {
    lessonMap[l.id] = l;
  });
});
