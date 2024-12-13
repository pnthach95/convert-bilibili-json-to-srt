import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";

dayjs.extend(duration);

type Subtitle = {
  font_size: number;
  font_color: string;
  background_alpha: number;
  background_color: number;
  Stroke: string;
  body: {
    from: number;
    to: number;
    location: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
    content: string;
  }[];
};

const timeFormat = "HH:mm:ss,";
const filename = "file name without extension";
const inputFile = Bun.file(filename + ".json");

async function run() {
  let output = "";
  const data = (await inputFile.json()) as Subtitle;
  console.log("Number of lines", data.body.length);
  data.body.forEach((d, i) => {
    const fromS = d.from.toString().split(".");
    const toS = d.to.toString().split(".");
    const from = dayjs.duration(parseInt(fromS[0]), "second");
    const to = dayjs.duration(parseInt(toS[0]), "second");
    const fromT = from.format(timeFormat);
    const toT = to.format(timeFormat);
    const fromMS = (parseFloat(`0.${fromS[1]}`) * 100).toFixed(0);
    const toMS = (parseFloat(`0.${toS[1] || 0}`) * 100).toFixed(0);
    output +=
      [i + 1, `${fromT}${fromMS} --> ${toT}${toMS}`, d.content].join("\n") +
      "\n\n";
  });
  await Bun.write(filename + ".srt", output);
}

run();
