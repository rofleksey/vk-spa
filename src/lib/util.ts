import { Gender } from "@/lib/vk";
import type { VkUser } from "@/lib/vk";

const birthRegex = /(\d+)\.(\d+)\.(\d+)/;
const birthRegexIncomplete = /(\d+)\.(\d+)/;

function getAge(bdate: string, sex: Gender | undefined): string {
  const matchFull = birthRegex.exec(bdate);
  const matchIncomplete = birthRegexIncomplete.exec(bdate);
  if (matchFull) {
    const birthDate = new Date(
      Number(matchFull[3]),
      Number(matchFull[2]),
      Number(matchFull[1]),
      0,
      0,
      0,
      0
    );
    // @ts-ignore
    const diffYears = Math.floor((new Date() - birthDate) / 31556952000);
    return `${diffYears} лет`;
  }
  if (matchIncomplete) {
    let genderedString: string;
    if (sex === Gender.FEMALE) {
      genderedString = "Родилась";
    } else {
      genderedString = "Родился";
    }
    return `${genderedString} ${matchIncomplete[1]
      .toString()
      .padStart(2, "0")}.${matchIncomplete[2].padStart(2, "0")}`;
  }
  return "Дата рождения неизвестна";
}

export function getDescription(vkUser: VkUser): string {
  const builder: string[] = [];
  if (vkUser.counters) {
    builder.push(`${vkUser.counters.friends} друзей`);
  }
  if (vkUser.sex) {
    if (vkUser.sex === Gender.MALE) {
      builder.push("Мужчина");
    } else if (vkUser.sex === Gender.FEMALE) {
      builder.push("Женщина");
    } else {
      builder.push("Пол скрыт");
    }
  } else {
    builder.push("Пол скрыт");
  }
  if (vkUser.bdate) {
    builder.push(getAge(vkUser.bdate, vkUser.sex));
  } else {
    builder.push("Дата рождения скрыта");
  }
  return builder.join(" • ");
}
