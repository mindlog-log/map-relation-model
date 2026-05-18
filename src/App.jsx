import React, { useMemo, useRef, useState } from "react";


import { BookOpen, History, RotateCcw, Save, Shuffle, Sparkles } from "lucide-react";
function Button({ className = "", children, ...props }) {
  return (
    <button
      className={`inline-flex items-center justify-center rounded-xl px-4 py-2 font-semibold transition disabled:opacity-50 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

function Card({ className = "", children }) {
  return <div className={className}>{children}</div>;
}

function CardContent({ className = "", children }) {
  return <div className={className}>{children}</div>;
}
const STATUS = {
  ACTIVE: { code: "A", label: "ACTIVE", jp: "正常循環", tone: "text-emerald-300", bg: "bg-emerald-500/15", border: "border-emerald-400/40" },
  DISTORTED: { code: "D", label: "DISTORTED", jp: "歪み・すれ違い", tone: "text-amber-300", bg: "bg-amber-500/15", border: "border-violet-300/40" },
  BLOCKED: { code: "B", label: "BLOCKED", jp: "停滞・接続停止", tone: "text-sky-300", bg: "bg-sky-500/15", border: "border-sky-400/40" },
  OVERLOADED: { code: "O", label: "OVERLOADED", jp: "感情過多・暴走", tone: "text-red-300", bg: "bg-red-500/15", border: "border-red-400/40" },
  INACTIVE: { code: "I", label: "INACTIVE", jp: "気持ち低下・反応弱化", tone: "text-neutral-300", bg: "bg-neutral-500/15", border: "border-neutral-400/40" },
  UNSTABLE: { code: "U", label: "UNSTABLE", jp: "揺れ・不安定", tone: "text-violet-300", bg: "bg-violet-500/15", border: "border-violet-400/40" },
  DISPERSED: { code: "S", label: "DISPERSED", jp: "気持ち分散", tone: "text-cyan-300", bg: "bg-cyan-500/15", border: "border-cyan-400/40" },
  COLLAPSED: { code: "C", label: "COLLAPSED", jp: "関係崩壊", tone: "text-orange-300", bg: "bg-orange-500/15", border: "border-orange-400/40" },
};

const GUIDE = {
  ACTIVE: {
    judgment: "今は流れが自然に動きやすい状態です。無理に大きく動かさなくても、素直な行動が通りやすくなっています。",
    advice: "自然な会話や軽い接触を大切にしてみてください。強く押し込むより、今ある流れを丁寧に育てることで、関係は安定しやすくなります。"
  },
  DISTORTED: {
    judgment: "今は受け取り方や解釈に少しズレが出やすい状態です。相手の言葉や態度を、必要以上に深く考えてしまうことがあるかもしれません。",
    advice: "すぐに決めつけず、事実と感情を分けて見てみてください。確認したいことがある場合も、責める言い方ではなく、落ち着いた言葉で確かめると流れが乱れにくくなります。"
  },
  BLOCKED: {
    judgment: "今は流れが少し止まりやすい状態です。無理に進めようとすると、かえって距離感が固まりやすくなるかもしれません。",
    advice: "強く答えを求めるよりも、相手が返しやすい余白を残しておく方がよさそうです。短い連絡や自然な会話のように、負担の少ない関わり方を意識すると、少しずつ流れが戻りやすくなります。"
  },
  OVERLOADED: {
    judgment: "今は感情や関係性に負荷がかかりやすい状態です。気持ちが強くなるほど、言葉や行動も少し強く出やすくなっています。",
    advice: "今は、強い言葉や何度も確認するような行動は少し控えた方がよさそうです。気持ちが高ぶっている時ほど、一度時間を置いてから動くことで、関係の流れが落ち着きやすくなります。"
  },
  INACTIVE: {
    judgment: "今は気持ちや行動の反応が少し弱まりやすい状態です。動きが少なく見えても、それがすぐに終わりを意味するとは限りません。",
    advice: "無理に盛り上げようとせず、静かに流れを保つことを意識してみてください。相手や自分の余力を見ながら、負担の少ない接点を残しておくと、自然な回復につながりやすくなります。"
  },
  UNSTABLE: {
    judgment: "今は気持ちや状況が揺れやすい状態です。その時の不安や勢いに引っ張られて、判断が変わりやすくなっているかもしれません。",
    advice: "すぐに結論を出さず、少し時間を置いて状態を見てみてください。関係を急いで進めるよりも、まず安心できる流れを整えることが大切です。"
  },
  DISPERSED: {
    judgment: "今は意識や気持ちが散りやすい状態です。相手、自分、状況のどこに力を向けるべきかが少し見えにくくなっています。",
    advice: "一度、考えることや動くことを少し絞ってみてください。相手の反応を追いすぎるより、自分が本当に大切にしたいことを整理すると、流れが戻りやすくなります。"
  },
  COLLAPSED: {
    judgment: "今は、関係の形や流れが大きく乱れやすい状態です。すぐに元へ戻そうとすると、さらに負荷がかかってしまう場合があります。",
    advice: "まずは立て直そうと急ぐより、何が負担になっていたのかを落ち着いて見直す時間を取ってみてください。距離を置くことも、関係を終わらせるためではなく、もう一度整えるための余白になる場合があります。"
  }
};

const ATTRIBUTES = {
  M: { name: "MIND", jp: "内面・本音・関係意識", accent: "from-violet-500/30 to-fuchsia-500/10", orb: "bg-violet-400" },
  D: { name: "DRIVE", jp: "接近・行動・推進力", accent: "from-orange-500/30 to-red-500/10", orb: "bg-orange-400" },
  E: { name: "EMOTION", jp: "感情・共感・温度感", accent: "from-rose-500/30 to-pink-500/10", orb: "bg-rose-400" },
  T: { name: "THINKING", jp: "認識・解釈・思考", accent: "from-sky-500/30 to-blue-500/10", orb: "bg-sky-400" },
  R: { name: "REALITY", jp: "現実関係・距離・進展", accent: "from-lime-500/30 to-emerald-500/10", orb: "bg-lime-400" },
};

const CARD_DATA = [
  { key: "M00", attr: "M", no: 0, upright: "関係性の方向性はまだ定まりきっていないが、自然な興味や接続意識が生まれ始めている状態", reversedStatus: "UNSTABLE", reversed: "気持ちや関係性の方向が定まらず、感情や距離感がまとまっていない状態" },
  { key: "M01", attr: "M", no: 1, upright: "自分の気持ちと関係性への意識が一致し、迷いなく相手と向き合えている状態", reversedStatus: "UNSTABLE", reversed: "気持ちや関係性への意識が噛み合わず、感情や距離感に不安定さが出ている状態" },
  { key: "M02", attr: "M", no: 2, upright: "相手との空気感や流れと自然に調和し、無理なく関係へ入れている状態", reversedStatus: "DISTORTED", reversed: "相手との空気感や流れが噛み合わず、関係性に違和感やズレが生じている状態" },
  { key: "M03", attr: "M", no: 3, upright: "相手との関係性の中で自然に自分を表現し、安心感を保ちながら関われている状態", reversedStatus: "UNSTABLE", reversed: "相手の影響を受けすぎてしまい、自分らしい距離感や感情を保てていない状態" },
  { key: "M04", attr: "M", no: 4, upright: "関係性への意識や責任感が安定し、自分の役割を理解しながら向き合えている状態", reversedStatus: "OVERLOADED", reversed: "気持ちの力みや重圧が強くなり、関係性に不自然さや硬さが出ている状態" },
  { key: "M05", attr: "M", no: 5, upright: "経験や感情が自然に結びつき、相手との反応や距離感が噛み合っている状態", reversedStatus: "DISTORTED", reversed: "感情や反応がうまく噛み合わず、関係性に迷いやズレが生じている状態" },
  { key: "M06", attr: "M", no: 6, upright: "相手との流れや呼吸が自然に噛み合い、関係性の中で心地よい循環が生まれている状態", reversedStatus: "BLOCKED", reversed: "相手との流れが噛み合わず、関係性や距離感が停滞している状態" },
  { key: "M07", attr: "M", no: 7, upright: "相手へ向かう気持ちが強まり、感情や意識を真っ直ぐ関係性へ向けられている状態", reversedStatus: "OVERLOADED", reversed: "気持ちの強さが不安定になり、感情や関係性が空回りしている状態" },
  { key: "M08", attr: "M", no: 8, upright: "相手との距離感を冷静に見ながら、自分の感情や関係性とのバランスを保てている状態", reversedStatus: "DISTORTED", reversed: "相手との距離感が噛み合わず、感情や関係性に乱れが出ている状態" },
  { key: "M09", attr: "M", no: 9, upright: "相手へ流されすぎず、自分の本音や感覚を保ちながら落ち着いて向き合えている状態", reversedStatus: "INACTIVE", reversed: "気持ちが定まらず、関係性への意識や感情が散漫になっている状態" },
  { key: "M10", attr: "M", no: 10, upright: "関係性の流れや空気感と自然に噛み合い、無理なく相手と向き合えている状態", reversedStatus: "BLOCKED", reversed: "関係性の流れと噛み合わず、距離感や接続に違和感が生じている状態" },
  { key: "M11", attr: "M", no: 11, upright: "内側から自然に感情が湧き上がり、素直な気持ちとして相手へ向かっている状態", reversedStatus: "DISTORTED", reversed: "感情や気持ちが不安定で、相手へうまく伝えられていない状態" },
  { key: "M12", attr: "M", no: 12, upright: "停滞の中でも関係性の変化を受け入れ、新しい流れへ切り替わろうとしている状態", reversedStatus: "DISPERSED", reversed: "停滞から抜け出せず、関係性の流れが切り替わっていない状態" },
  { key: "M13", attr: "M", no: 13, upright: "これまでの関係性や感情を整理し、新しい距離感や流れへ移行し始めている状態", reversedStatus: "OVERLOADED", reversed: "過去への執着や未整理な感情に引っ張られ、関係性が切り替えられていない状態" },
  { key: "M14", attr: "M", no: 14, upright: "複数の感情や距離感が自然に調和し、安定した関係性としてまとまっている状態", reversedStatus: "BLOCKED", reversed: "感情や距離感のバランスが崩れ、関係性にまとまりがなくなっている状態" },
  { key: "M15", attr: "M", no: 15, upright: "現実的な条件や距離感を受け入れながらも、自然に関係性へ向き合えている状態", reversedStatus: "OVERLOADED", reversed: "条件や不安へ意識が引っ張られ、関係性に力みや不自然さが出ている状態" },
  { key: "M16", attr: "M", no: 16, upright: "崩れた関係性や感情を受け入れ、不要な執着を手放しながら再構築へ向かっている状態", reversedStatus: "COLLAPSED", reversed: "関係性の崩れを受け入れられず、表面的に維持しようとしている状態" },
  { key: "M17", attr: "M", no: 17, upright: "相手や周囲に左右されすぎず、自分の気持ちや関係性への信頼を保てている状態", reversedStatus: "INACTIVE", reversed: "不安や揺らぎへ意識が引っ張られ、関係性への安定感が弱くなっている状態" },
  { key: "M18", attr: "M", no: 18, upright: "相手の気持ちや関係性の流れが掴みきれず、感情や距離感に曖昧さが残っている状態", reversedStatus: "DISTORTED", reversed: "曖昧だった感情や関係性への認識が整理され、少しずつ明確さが戻っている状態" },
  { key: "M19", attr: "M", no: 19, upright: "感情や気持ちが自然に開放され、迷いなく素直な状態で相手と向き合えている状態", reversedStatus: "BLOCKED", reversed: "気持ちが抑え込まれ、関係性や感情表現に迷いや停滞が出ている状態" },
  { key: "M20", attr: "M", no: 20, upright: "これまでの経験や感情が内側で整理され、関係性への理解として自然に統合されている状態", reversedStatus: "DISPERSED", reversed: "経験や感情が整理されず、関係性や気持ちに分断や迷いが生じている状態" },
  { key: "M21", attr: "M", no: 21, upright: "感情・距離感・関係性が一つにまとまり、自然体な関係として安定して機能している状態", reversedStatus: "COLLAPSED", reversed: "関係性や気持ちの統合が不完全で、どこかにズレや欠けが残っている状態" },
  { key: "D01", attr: "D", no: 1, upright: "相手へ向かう気持ちや行動意欲が自然に生まれ、関係へ意識が向き始めている状態", reversedStatus: "DISPERSED", reversed: "気持ちや行動の方向が定まらず、関係へ意識をうまく向けられていない状態" },
  { key: "D02", attr: "D", no: 2, upright: "内側に関係性へのエネルギーが集まり、相手と向き合う準備が整い始めている状態", reversedStatus: "INACTIVE", reversed: "気持ちが内側へ留まり、関係性へ行動として向けられていない状態" },
  { key: "D03", attr: "D", no: 3, upright: "相手へ向かう勢いが高まり、積極的に関係へ入ろうとしている状態", reversedStatus: "OVERLOADED", reversed: "気持ちや勢いが過剰になり、関係性へ不安定さや暴走が出ている状態" },
  { key: "D04", attr: "D", no: 4, upright: "関係性への行動力が自然な流れに乗り、無理なく相手と関われている状態", reversedStatus: "DISTORTED", reversed: "関係性の流れへ乗りきれず、接し方や行動にズレが出ている状態" },
  { key: "D05", attr: "D", no: 5, upright: "感情や行動エネルギーが強く高まり、相手へ向かう意識が大きく外へ出ている状態", reversedStatus: "OVERLOADED", reversed: "感情や行動意欲が過剰または分散し、関係性へうまく集中できていない状態" },
  { key: "D06", attr: "D", no: 6, upright: "相手への気持ちや行動の方向性が変化し、関係性に新しい流れが生まれ始めている状態", reversedStatus: "DISPERSED", reversed: "気持ちや行動の方向が定まらず、関係性への意識が複数方向へ分散している状態" },
  { key: "D07", attr: "D", no: 7, upright: "複数の感情や行動意欲が同時に働き、勢いが強く不安定に外へ出ている状態", reversedStatus: "COLLAPSED", reversed: "感情や行動エネルギーが衝突・暴走し、関係性の制御が崩れている状態" },
  { key: "D08", attr: "D", no: 8, upright: "感情や行動エネルギーが消耗し、関係性への勢いが徐々に弱まり始めている状態", reversedStatus: "INACTIVE", reversed: "気持ちが尽きかけながらも、関係性をうまく切り替えられず停滞している状態" },
  { key: "D09", attr: "D", no: 9, upright: "気持ちや行動が遮られ、相手へ向かおうとしても関係性が進みにくい状態", reversedStatus: "BLOCKED", reversed: "感情や行動エネルギーが閉じ込み気味になり、接近そのものが難しくなっている状態" },
  { key: "D10", attr: "D", no: 10, upright: "感情や行動エネルギーが止まり、一度関係性への気持ちが空白状態になっている状態", reversedStatus: "INACTIVE", reversed: "気持ちが止まったまま停滞し、次の関係性へ切り替えられていない状態" },
  { key: "D11", attr: "D", no: 11, upright: "弱まった気持ちへ負荷がかかり、無理をしながら関係性を維持している状態", reversedStatus: "OVERLOADED", reversed: "感情や行動エネルギーが弱く、関係性を維持しきれなくなっている状態" },
  { key: "D12", attr: "D", no: 12, upright: "停滞していた気持ちや行動に変化が生まれ、再び関係性へ向かう流れが戻り始めている状態", reversedStatus: "BLOCKED", reversed: "変化が起こりきらず、停滞状態から抜け出せていない状態" },
  { key: "D13", attr: "D", no: 13, upright: "感情や行動エネルギーが再構築され、安定した関係性としてまとまり始めている状態", reversedStatus: "DISTORTED", reversed: "気持ちや行動の再構築が不完全で、関係性に不安定さが残っている状態" },
  { key: "D14", attr: "D", no: 14, upright: "感情や行動を抑え込み、気持ちを内側へ留めている状態", reversedStatus: "UNSTABLE", reversed: "抑え込まれていた気持ちが解放され、再び相手へ向かい始めている状態" },
  { key: "E01", attr: "E", no: 1, upright: "感情が自然に相手へ向かい、気持ちや空気感を素直に受け取れている状態", reversedStatus: "UNSTABLE", reversed: "感情の流れに不安定さが混ざり、相手との呼吸や距離感が噛み合っていない状態" },
  { key: "E02", attr: "E", no: 2, upright: "感情が開かれ、相手からの言葉や反応を自然に受け取れている状態", reversedStatus: "DISTORTED", reversed: "相手の影響を受けすぎてしまい、感情や関係性が不安定になっている状態" },
  { key: "E03", attr: "E", no: 3, upright: "感情が大きく膨らみ、前向きな気持ちとして相手へ向かっている状態", reversedStatus: "OVERLOADED", reversed: "感情が空回りし、現実の関係性と噛み合わなくなっている状態" },
  { key: "E04", attr: "E", no: 4, upright: "感情が軽やかに流れ、余計な執着なく自然体で相手と関われている状態", reversedStatus: "DISTORTED", reversed: "感情との距離を取りすぎてしまい、関係性への関わりが浅くなっている状態" },
  { key: "E05", attr: "E", no: 5, upright: "感情が内側で安定し、自分の気持ちや距離感を保ちながら関われている状態", reversedStatus: "UNSTABLE", reversed: "感情が不安定で、相手への意識が強くなりすぎて迷いが出ている状態" },
  { key: "E06", attr: "E", no: 6, upright: "感情が一人の相手へ集中し、強い気持ちを持って関係性へ向かっている状態", reversedStatus: "OVERLOADED", reversed: "感情が一つに偏りすぎてしまい、周囲や現実が見えなくなっている状態" },
  { key: "E07", attr: "E", no: 7, upright: "感情が広がり、様々な空気感や関係性へ柔軟に反応できている状態", reversedStatus: "DISPERSED", reversed: "感情が分散し、本来の気持ちや関係性から意識が離れている状態" },
  { key: "E08", attr: "E", no: 8, upright: "安心感を求めて感情が内側へ向かい、自分の気持ちや距離感を守ろうとしている状態", reversedStatus: "BLOCKED", reversed: "閉じていた感情が緩み、再び相手へ反応し始めている状態" },
  { key: "E09", attr: "E", no: 9, upright: "感情が満たされず、寂しさや不足感を抱えたまま関係性へ向き合っている状態", reversedStatus: "INACTIVE", reversed: "停滞していた感情に変化が入り、気持ちの流れが戻り始めている状態" },
  { key: "E10", attr: "E", no: 10, upright: "感情の流れが安定し、無理なく自然体で相手と関われている状態", reversedStatus: "DISTORTED", reversed: "快適さへ偏りすぎてしまい、感情の流れが浅くなっている状態" },
  { key: "E11", attr: "E", no: 11, upright: "感情が一箇所に滞り、気持ちの偏りが関係性へ影響している状態", reversedStatus: "BLOCKED", reversed: "停滞していた感情が動き始め、気持ちの流れに変化が出始めている状態" },
  { key: "E12", attr: "E", no: 12, upright: "感情が消耗しきり、気持ちや反応の動きが弱くなっている状態", reversedStatus: "INACTIVE", reversed: "止まっていた感情にわずかな反応が戻り始めている状態" },
  { key: "E13", attr: "E", no: 13, upright: "感情が満たされ、充実した気持ちで自然に関係性へ向き合えている状態", reversedStatus: "UNSTABLE", reversed: "満足感が長続きせず、次の流れや刺激へ意識が移り始めている状態" },
  { key: "E14", attr: "E", no: 14, upright: "満たされた状態のまま変化がなく、感情の流れが停滞している状態", reversedStatus: "BLOCKED", reversed: "停滞していた感情が崩れ、新しい流れや関係性へ向かい始めている状態" },
  { key: "T01", attr: "T", no: 1, upright: "相手や関係性への意識が集中し、気持ちや考えが明確になっている状態", reversedStatus: "DISTORTED", reversed: "視野が狭くなり、一つの考えや思い込みへ偏ってしまっている状態" },
  { key: "T02", attr: "T", no: 2, upright: "感情に流されず、関係性を客観的かつ冷静に見られている状態", reversedStatus: "DISTORTED", reversed: "考え方が冷たさや批判へ偏り、柔軟な認識が失われている状態" },
  { key: "T03", attr: "T", no: 3, upright: "不要な思い込みや不安へ気づき、それを整理しようとしている状態", reversedStatus: "OVERLOADED", reversed: "否定的な認識へ偏り、相手や関係性を狭く見てしまっている状態" },
  { key: "T04", attr: "T", no: 4, upright: "感情の乱れを整理し、現実の関係性や距離感を見ようとしている状態", reversedStatus: "DISTORTED", reversed: "不安や感情の揺れへ引っ張られ、認識が曇っている状態" },
  { key: "T05", attr: "T", no: 5, upright: "洞察や理解によって認識が整理され、関係性の方向性が明確になっている状態", reversedStatus: "DISTORTED", reversed: "考えがまとまらず、判断や関係性の方向が曖昧になっている状態" },
  { key: "T06", attr: "T", no: 6, upright: "考え込みすぎず、自然な流れへ意識を委ねながら相手と向き合えている状態", reversedStatus: "INACTIVE", reversed: "認識を放棄し、関係性や現実から意識を切り離している状態" },
  { key: "T07", attr: "T", no: 7, upright: "不安やネガティブな認識が強くなり、相手や関係性を歪めて見ている状態", reversedStatus: "OVERLOADED", reversed: "認識の偏りが極端になり、現実とのズレが大きくなっている状態" },
  { key: "T08", attr: "T", no: 8, upright: "余計な評価を入れず、相手や関係性を静かに観察している状態", reversedStatus: "INACTIVE", reversed: "無関心や回避へ偏り、関係性との距離が開いている状態" },
  { key: "T09", attr: "T", no: 9, upright: "関係性の不安や不利な流れを認識し、気持ちが後ろ向きになっている状態", reversedStatus: "BLOCKED", reversed: "無力感や絶望感に囚われ、認識そのものが閉じている状態" },
  { key: "T10", attr: "T", no: 10, upright: "感情へ流されず、関係性や距離感を冷静に分析できている状態", reversedStatus: "DISTORTED", reversed: "分析へ偏りすぎてしまい、関係性が断片的になっている状態" },
  { key: "T11", attr: "T", no: 11, upright: "関係性に意味を見出せず、気持ちが空虚になっている状態", reversedStatus: "INACTIVE", reversed: "無意味感へ囚われ、認識や思考が停滞している状態" },
  { key: "T12", attr: "T", no: 12, upright: "相反する考えがぶつかり合い、認識や判断がまとまっていない状態", reversedStatus: "DISPERSED", reversed: "混乱へ飲み込まれ、認識そのものが機能しづらくなっている状態" },
  { key: "T13", attr: "T", no: 13, upright: "自分への不安や迷いが強くなり、関係性へ自信を持てなくなっている状態", reversedStatus: "BLOCKED", reversed: "自己否定や不安へ支配され、認識が閉じ込み気味になっている状態" },
  { key: "T14", attr: "T", no: 14, upright: "執着や固定観念を手放し、認識を解放しようとしている状態", reversedStatus: "BLOCKED", reversed: "考えや執着を手放せず、認識が縛られている状態" },
  { key: "R01", attr: "R", no: 1, upright: "関係性の基盤が整い、安心感を持ちながら自然に相手と関われている状態", reversedStatus: "BLOCKED", reversed: "関係性の基盤が硬くなりすぎ、柔軟な接し方や距離感が取りづらくなっている状態" },
  { key: "R02", attr: "R", no: 2, upright: "現実の距離感や状況の中で安定し、無理なく自然体で関われている状態", reversedStatus: "INACTIVE", reversed: "関係性は維持されているが変化が少なく、停滞感が出ている状態" },
  { key: "R03", attr: "R", no: 3, upright: "関係性の方向性が現実の中で形になり、流れが整理され始めている状態", reversedStatus: "DISTORTED", reversed: "関係性への意識が偏りすぎ、現実との噛み合いが弱くなっている状態" },
  { key: "R04", attr: "R", no: 4, upright: "関係性を進めながら、現実の中で安定した流れを保てている状態", reversedStatus: "OVERLOADED", reversed: "進展が停滞し、必要な変化や行動が先送りになっている状態" },
  { key: "R05", attr: "R", no: 5, upright: "現実の中で関係性の軸が安定し、自分らしい距離感を保てている状態", reversedStatus: "UNSTABLE", reversed: "関係性の軸が不安定になり、現実感覚や距離感が揺らいでいる状態" },
  { key: "R06", attr: "R", no: 6, upright: "現実の関係性や距離感が変化し、新しい流れへ切り替わり始めている状態", reversedStatus: "DISTORTED", reversed: "変化が停滞し、古い関係性や状態に留まり続けている状態" },
  { key: "R07", attr: "R", no: 7, upright: "現実へ働きかける力が生まれ、関係性の構造が動き始めている状態", reversedStatus: "BLOCKED", reversed: "働きかけが過剰になり、関係性や距離感を乱している状態" },
  { key: "R08", attr: "R", no: 8, upright: "現実の関係構造が固定され、自由な動きや変化が制限されている状態", reversedStatus: "COLLAPSED", reversed: "固定されていた関係性が緩み、少しずつ新しい流れが生まれ始めている状態" },
  { key: "R09", attr: "R", no: 9, upright: "現実の関係性が不安定になり、距離感や流れに揺らぎが出ている状態", reversedStatus: "UNSTABLE", reversed: "不安定だった関係性が整理され、安定へ向かい始めている状態" },
  { key: "R10", attr: "R", no: 10, upright: "現実の関係性が形となり、一定の距離感や流れとして成立している状態", reversedStatus: "DISTORTED", reversed: "結果や形へ偏り、本来の関係性とのズレが生じている状態" },
  { key: "R11", attr: "R", no: 11, upright: "現実的な制限を受け、自由な接触や距離感が取りづらくなっている状態", reversedStatus: "BLOCKED", reversed: "制限が緩み始め、関係性や距離感に余裕が戻ってきている状態" },
  { key: "R12", attr: "R", no: 12, upright: "慎重さを保ちながら、自ら感情や行動を抑えて関係性を維持している状態", reversedStatus: "OVERLOADED", reversed: "防御や慎重さが過剰になり、関係性が制限されている状態" },
  { key: "R13", attr: "R", no: 13, upright: "現実の流れや距離感を自然に受け入れ、そのままの状態で関係性を保てている状態", reversedStatus: "DISTORTED", reversed: "現実への抵抗や違和感が強く、関係性との噛み合いが崩れている状態" },
  { key: "R14", attr: "R", no: 14, upright: "現実の流れの中で、一歩ずつ安定して関係性を進められている状態", reversedStatus: "OVERLOADED", reversed: "関係性への不安が強まり、無理に流れをコントロールしようとしている状態" },
];

const APP_TEXT = [
  {
    "card": 0,
    "up": "これから物事が始まろうとしており、可能性がまだ柔らかく広がっている状態です。方向は固定されていませんが、自然に動き出せる余白があります。",
    "down": "始まりの気配はあるものの、まだ方向が定まりきっていない状態です。無理に動くより、まず流れが見えてくるのを待つ段階です。"
  },
  {
    "card": 1,
    "up": "内側に意志が生まれ、行動の方向性が少しずつはっきりしていく状態です。自分から動き出す力が整い始めています。",
    "down": "意志はあるものの、まだ力がまとまりきっていない状態です。方向を急いで決めるより、何をしたいのかを整理する必要があります。"
  },
  {
    "card": 2,
    "up": "外からの情報や気配を自然に受け取り、落ち着いて観察できている状態です。判断を急がず、必要なものを見極められます。",
    "down": "情報が多すぎたり少なすぎたりして、受け取り方が不安定になりやすい状態です。今は一度整理し、確かな情報を選ぶことが大切です。"
  },
  {
    "card": 3,
    "up": "感情と現実が結びつき、何かを形にしやすい創造的な状態です。内側にあるものが自然に外へ表れやすくなっています。",
    "down": "イメージや気持ちはあるものの、まだ形にしきれていない状態です。焦って完成させるより、流れがまとまる時間が必要です。"
  },
  {
    "card": 4,
    "up": "基盤が安定し、現実をしっかり支えられている状態です。落ち着いた力で維持や管理がしやすくなっています。",
    "down": "安定の土台が少し揺らぎやすく、整え直しが必要な状態です。無理に進めるより、足元を確認することが大切です。"
  },
  {
    "card": 5,
    "up": "経験から学びを受け取り、意味やルールを整理できている状態です。過去の知識を今の判断に活かしやすくなっています。",
    "down": "学びや情報が断片的になり、理解がまとまりにくい状態です。今は答えを急がず、何を学んでいるのかを整理する段階です。"
  },
  {
    "card": 6,
    "up": "選択や関係性が自然に整理され、進む方向が見えやすくなっている状態です。大切なつながりや判断に向き合いやすい流れです。",
    "down": "選択に迷いがあり、気持ちや関係性の方向が定まりにくい状態です。決める前に、自分が何を大切にしたいのかを見直す必要があります。"
  },
  {
    "card": 7,
    "up": "勢いとコントロールのバランスが取れ、前へ進みやすい状態です。目的に向かって力をまとめながら動けています。",
    "down": "勢いが弱まるか、逆に強すぎて扱いにくくなっている状態です。今は進む力と止める力のバランス調整が必要です。"
  },
  {
    "card": 8,
    "up": "感情や衝動を穏やかに整え、内側の力を落ち着いて扱えている状態です。静かな強さを保ちながら進めます。",
    "down": "感情が揺れやすく、内側を整えるのに少し時間が必要な状態です。強く抑え込むより、ゆっくり落ち着かせることが大切です。"
  },
  {
    "card": 9,
    "up": "外の流れから少し距離を取り、自分の内側を深く見つめている状態です。静かに考えることで、本質に近づきやすくなっています。",
    "down": "内側にこもりすぎて、視野が少し狭くなりやすい状態です。ひとりで抱え込みすぎず、必要なら外の視点も取り入れると流れが整います。"
  },
  {
    "card": 10,
    "up": "流れが切り替わり、新しい変化が自然に動き始めている状態です。状況の巡りが変わり、次の展開へ進みやすくなっています。",
    "down": "変化の流れはあるものの、切り替わりがゆっくり進んでいる状態です。今は無理に動かすより、変化のタイミングを見極める段階です。"
  },
  {
    "card": 11,
    "up": "感情と理性のバランスが取れ、落ち着いて判断しやすい状態です。偏りが少なく、公平に状況を見られています。",
    "down": "バランスが少し崩れ、判断が揺れやすくなっている状態です。感情と理屈のどちらかに寄りすぎていないか確認する必要があります。"
  },
  {
    "card": 12,
    "up": "一度立ち止まり、状況を見直すことで新しい視点が得られる状態です。止まること自体が整理の時間になっています。",
    "down": "止まった状態が長引き、動き出すきっかけを探している状態です。今は焦らず、見方を変えることで流れが戻りやすくなります。"
  },
  {
    "card": 13,
    "up": "ひとつの流れが終わり、新しい流れへ移行し始めている状態です。手放すことで次の形が見えやすくなっています。",
    "down": "切り替えが途中で止まり、古い流れを手放しきれていない状態です。無理に終わらせるより、整理しながら移行する必要があります。"
  },
  {
    "card": 14,
    "up": "乱れていた流れが整い、全体が穏やかに循環し始めている状態です。調和が戻り、無理なく安定しやすくなっています。",
    "down": "流れが少し乱れ、再調整が必要な状態です。急いで整えようとするより、少しずつバランスを戻すことが大切です。"
  },
  {
    "card": 15,
    "up": "強い欲求や動機が、前に進む力として働いている状態です。向かう先がはっきりしていれば、大きな推進力になります。",
    "down": "欲求やこだわりが強くなりすぎて、流れに偏りが出やすい状態です。何に引き寄せられているのかを見直す必要があります。"
  },
  {
    "card": 16,
    "up": "古い構造が変わり、新しい形へ移行するための大きな転換が起きている状態です。崩れることで再構築の余地が生まれています。",
    "down": "変化が途中で止まり、切り替えに抵抗が出やすい状態です。今は壊すことより、何を整え直すのかを見極める段階です。"
  },
  {
    "card": 17,
    "up": "希望や回復の兆しが見え、未来への見通しが少しずつ開けている状態です。静かに流れを信じられる余裕が戻っています。",
    "down": "希望が見えにくく、回復のタイミングを待っている状態です。今は大きく進むより、小さな安心を積み直すことが大切です。"
  },
  {
    "card": 18,
    "up": "感覚や直感が働き、まだ曖昧な状況の中でも流れを感じ取れている状態です。はっきりしないものを急がず扱えます。",
    "down": "感覚が揺れやすく、不安や迷いが混ざりやすい状態です。今は結論を急がず、見えていることと感じていることを分ける必要があります。"
  },
  {
    "card": 19,
    "up": "迷いが減り、物事の方向性が明るく見えやすくなっている状態です。素直な力が出やすく、流れも開きやすくなっています。",
    "down": "方向性がまだ固まりきらず、明るさを感じにくい状態です。焦らず見極めることで、少しずつ見通しが戻りやすくなります。"
  },
  {
    "card": 20,
    "up": "過去と現在を整理し、新しい判断へ更新できている状態です。これまでの流れを踏まえて、次の段階へ進みやすくなっています。",
    "down": "過去の影響が残り、判断の更新が少し遅れている状態です。今は責めるより、何を整理すれば前へ進めるかを見る段階です。"
  },
  {
    "card": 21,
    "up": "全体がまとまり、一つの流れとして完成に近づいている状態です。バラバラだった要素がつながり、安定した循環が生まれています。",
    "down": "統合がまだ途中で、全体が整いきっていない状態です。足りない部分を補いながら、少しずつ完成へ向かう段階です。"
  },
  {
    "card": 22,
    "up": "小さな行動が自然に始まり、現実に少しずつ影響が出ている状態です。無理のない一歩が流れを動かし始めています。",
    "down": "行動のきっかけがつかみにくく、少し動き出しにくい状態です。まずは小さく始められることを見つける必要があります。"
  },
  {
    "card": 23,
    "up": "行動に勢いが生まれ、流れが外へ広がっている状態です。動くことで周囲にも影響が届きやすくなっています。",
    "down": "勢いが少し弱まり、進行がゆっくりになっている状態です。今は無理に加速するより、力を整えてから進む方が安定します。"
  },
  {
    "card": 24,
    "up": "強いエネルギーをうまく調整しながら進めている状態です。勢いを保ちつつ、必要なところで抑える力も働いています。",
    "down": "エネルギーの扱いが少し難しく、強すぎたり弱すぎたりしやすい状態です。今は力の出し方を調整することが大切です。"
  },
  {
    "card": 25,
    "up": "安定したリズムで継続できている状態です。大きな変化はなくても、積み重ねる力がしっかり働いています。",
    "down": "継続のリズムが乱れやすく、ペースが安定しにくい状態です。続けるためには、負担を減らして整える必要があります。"
  },
  {
    "card": 26,
    "up": "選択肢を整理しながら、進む方向を見極めている状態です。迷いはあっても、判断に向かう流れは生まれています。",
    "down": "選択肢が多く、判断が止まりやすい状態です。今はすぐに決めるより、何を優先するかを整理する必要があります。"
  },
  {
    "card": 27,
    "up": "状況に合わせて柔軟に調整できている状態です。無理に押し切らず、流れに合わせて進められています。",
    "down": "調整が少し難しく、バランスが崩れやすい状態です。今は動きながら整えるより、一度流れを確認することが大切です。"
  },
  {
    "card": 28,
    "up": "周囲の影響を受けながらも、自分の流れを保てている状態です。外の変化をうまく取り入れながら進めます。",
    "down": "外部の影響に左右されやすく、自分の流れが揺れやすい状態です。今は周囲より、自分の基準を確認する必要があります。"
  },
  {
    "card": 29,
    "up": "内側の力が高まり、自分を支える感覚が強くなっている状態です。自信を持って次の行動へ向かいやすくなっています。",
    "down": "自信が揺れやすく、内側の力が少し弱まりやすい状態です。無理に強く見せるより、まず自分を整えることが大切です。"
  },
  {
    "card": 30,
    "up": "感情が自然に動き、気持ちを表現しやすい状態です。感じたことが素直に流れへつながりやすくなっています。",
    "down": "感情が出にくかったり、逆に揺れやすかったりする状態です。今は気持ちを急いで形にせず、落ち着いて扱う必要があります。"
  },
  {
    "card": 31,
    "up": "感情を落ち着いて扱い、内側を安定させられている状態です。気持ちに飲まれず、穏やかに整えられています。",
    "down": "感情の整理が少し難しく、内側で揺れが起きやすい状態です。抑え込むより、何を感じているのかを確認することが大切です。"
  },
  {
    "card": 32,
    "up": "思考が広がり、理解や分析が深まっている状態です。新しい視点を取り入れながら、考えを発展させやすくなっています。",
    "down": "思考が広がりすぎて、まとまりにくくなっている状態です。今は考えを増やすより、必要な情報を整理する段階です。"
  },
  {
    "card": 33,
    "up": "考えが深まり、一時的に負荷が出やすい状態です。丁寧に整理すれば、理解が深まる流れへ変わりやすくなっています。",
    "down": "考えが少しずつ整理され、重さが軽くなり始めている状態です。無理に答えを急がず、思考を整える時間が必要です。"
  },
  {
    "card": 34,
    "up": "現実とのバランスが取れ、状況に合わせた調整が進んでいる状態です。理想と現実をつなげやすくなっています。",
    "down": "現実とのズレが見えやすく、調整が必要な状態です。今は理想を押し通すより、現実に合わせて整えることが大切です。"
  },
  {
    "card": 35,
    "up": "外部環境の影響で進行がゆっくりになっている状態です。止まっているように見えても、状況を整える時間になっています。",
    "down": "停滞が長引き、動き出すきっかけを待っている状態です。今は無理に進めるより、外側の条件が整うのを見極める必要があります。"
  },
  {
    "card": 36,
    "up": "新しい関係やつながりが自然に生まれ始めている状態です。まだ小さくても、関係が育つ余地があります。",
    "down": "関係がまだ育ちきらず、少し距離が残っている状態です。急いで近づくより、安心してつながれる流れを作ることが大切です。"
  },
  {
    "card": 37,
    "up": "関係性が変化しながら、次の形へ進んでいる状態です。距離感や関わり方が自然に調整されつつあります。",
    "down": "関係の変化が一時的に止まり、距離感が定まりにくい状態です。今は関係を急いで決めず、流れを見守る必要があります。"
  },
  {
    "card": 38,
    "up": "関係が安定し、落ち着いたつながりを保てている状態です。無理なく関わることで、安心感が続きやすくなっています。",
    "down": "安定が少し揺れやすく、関係の調整が必要な状態です。相手との距離感を丁寧に整えることで、流れが戻りやすくなります。"
  },
  {
    "card": 39,
    "up": "関係に動きがあり、距離感や流れが変化している状態です。揺れはありますが、変化を通して整理が進みやすくなっています。",
    "down": "関係が不安定で、距離感が揺れやすい状態です。今は反応を急がず、落ち着いて関係の流れを見ることが大切です。"
  },
  {
    "card": 40,
    "up": "流れが加速し、状況が一気に動き出している状態です。勢いをうまく使えれば、前進しやすいタイミングです。",
    "down": "流れが少し弱まり、進行がゆっくりになっている状態です。今は焦って加速するより、次に動く準備を整える段階です。"
  },
  {
    "card": 41,
    "up": "流れが一時的に止まり、状況を整理する時間が生まれている状態です。止まることで見直しが進みやすくなっています。",
    "down": "流れが長く止まり、動きにくさが強くなっている状態です。小さなきっかけを作ることで、少しずつ動きが戻りやすくなります。"
  },
  {
    "card": 42,
    "up": "止まっていた流れが再び動き始めている状態です。完全ではなくても、少しずつ再開する力が戻っています。",
    "down": "動き出しが遅れ、再開の準備をしている状態です。無理に進めるより、動ける条件を整えることが必要です。"
  },
  {
    "card": 43,
    "up": "内側にエネルギーが蓄積され、次に動くための力が溜まっている状態です。表には出ていなくても準備は進んでいます。",
    "down": "エネルギーが散りやすく、内側の安定が保ちにくい状態です。今は力を使うより、まず落ち着かせることが大切です。"
  },
  {
    "card": 44,
    "up": "内側にあった感情や考えが、自然に外へ流れ始めている状態です。抱えていたものを少しずつ表現しやすくなっています。",
    "down": "感情が外へ出にくく、内側に溜まりやすい状態です。無理に吐き出すより、安全に表現できる形を探す必要があります。"
  },
  {
    "card": 45,
    "up": "意識が一点に集中し、深く向き合えている状態です。余計なものが減り、必要な対象に力を注ぎやすくなっています。",
    "down": "集中が途切れやすく、意識が分散しやすい状態です。今はやることを絞り、ひとつずつ整えることが大切です。"
  },
  {
    "card": 46,
    "up": "意識が広がり、多角的に物事を見られている状態です。広い視野を持つことで、新しい気づきが生まれやすくなっています。",
    "down": "意識が広がりすぎて、まとまりにくくなっている状態です。今は視点を増やすより、必要なものを選ぶ段階です。"
  },
  {
    "card": 47,
    "up": "思考が整理され、落ち着いて判断しやすい状態です。情報を冷静に扱い、安定した答えに近づきやすくなっています。",
    "down": "思考が少し乱れ、判断が揺れやすい状態です。今は考え続けるより、情報を減らして整理することが必要です。"
  },
  {
    "card": 48,
    "up": "情報が整理されにくいものの、少しずつ調整している状態です。混乱の中から必要なものを選び直す流れがあります。",
    "down": "混乱が落ち着き始め、整理へ向かっている状態です。まだ完全ではありませんが、少しずつ見通しを取り戻しつつあります。"
  },
  {
    "card": 49,
    "up": "直感が自然に働き、感覚的な判断を活かしやすい状態です。理屈だけでは見えない流れを感じ取りやすくなっています。",
    "down": "直感と現実のバランスが崩れやすい状態です。感じたことをすぐ決めつけず、現実と照らし合わせる必要があります。"
  },
  {
    "card": 50,
    "up": "現実的な判断がしっかり働き、具体的な行動に移しやすい状態です。実務や結果を意識しながら進められます。",
    "down": "現実面に偏りすぎて、柔軟さや感情面が置き去りになりやすい状態です。今は実務だけでなく余白も必要です。"
  },
  {
    "card": 51,
    "up": "状態が少しずつ安定へ向かい始めている段階です。まだ途中でも、流れを整え直す力が戻りつつあります。",
    "down": "安定するまで少し時間が必要な状態です。今は急いで結果を出すより、回復の流れを丁寧に保つことが大切です。"
  },
  {
    "card": 52,
    "up": "停滞が続きながらも、内側では整理が進んでいる状態です。大きく動かなくても、次の準備をしている流れがあります。",
    "down": "停滞が長引き、動き出しにくさが強くなっている状態です。小さな変化を作ることで、流れが戻るきっかけになります。"
  },
  {
    "card": 53,
    "up": "次の変化が起こる直前で、準備が整いつつある状態です。まだ表には出ていなくても、流れは切り替わろうとしています。",
    "down": "変化のタイミングを待っている状態です。無理に動かすより、何が整えば変化できるのかを確認する段階です。"
  },
  {
    "card": 54,
    "up": "仕組みや構造そのものに変化が起きている状態です。表面的な変化ではなく、土台から流れが組み替わり始めています。",
    "down": "構造の変化が途中で止まり、調整が必要な状態です。今は無理に完成させず、どこを整えるべきかを見る段階です。"
  },
  {
    "card": 55,
    "up": "大きな変化が起き、古い安定から新しい形へ移ろうとしている状態です。揺れはありますが、再構築へ向かう流れがあります。",
    "down": "変化に混乱が伴い、整理が必要な状態です。今は崩れた部分を責めるより、新しく整える場所を見つけることが大切です。"
  },
  {
    "card": 56,
    "up": "新しい形への再構築が始まっている状態です。まだ完成ではありませんが、整え直すための流れは動き出しています。",
    "down": "再構築の準備が進んでいる状態です。すぐに形にするより、土台を確認しながら少しずつ作り直す段階です。"
  },
  {
    "card": 57,
    "up": "動きながらも安定を保てている状態です。変化の中でもバランスを取り、無理なく流れに乗りやすくなっています。",
    "down": "動きと安定のバランスが揺れている状態です。今は進むことと整えることの両方を意識する必要があります。"
  },
  {
    "card": 58,
    "up": "流れが不安定ながらも、まだ動きは続いている状態です。揺れを含みながら、次の安定点を探している流れです。",
    "down": "流れが乱れやすく、調整が必要な状態です。今は勢いよりも、どこで乱れているのかを確認することが大切です。"
  },
  {
    "card": 59,
    "up": "可能性が外へ広がり、選択肢が増えている状態です。視野が開き、新しい方向を見つけやすくなっています。",
    "down": "可能性がまだ十分に開いておらず、選択肢が見えにくい状態です。今は外へ広げる前に、内側の準備を整える段階です。"
  },
  {
    "card": 60,
    "up": "範囲が整理され、意識や力を集中しやすくなっている状態です。余計なものが減り、必要なことに向かいやすくなっています。",
    "down": "範囲が狭まりすぎて、柔軟さが弱まりやすい状態です。今は集中と閉塞の違いを見極める必要があります。"
  },
  {
    "card": 61,
    "up": "物事や人とのつながりが生まれ、流れが結びつき始めている状態です。関係や要素が自然に接続されやすくなっています。",
    "down": "つながりがまだ弱く、距離が残っている状態です。無理に結びつけるより、安心して近づける流れを作ることが大切です。"
  },
  {
    "card": 62,
    "up": "関係や流れが整理され、必要な距離感が見え始めている状態です。切り離すことで整うものもあります。",
    "down": "つながりが途切れやすく、孤立感が出やすい状態です。今は切るか残すかより、どんな距離が必要かを見直す段階です。"
  },
  {
    "card": 63,
    "up": "複数の要素がまとまり、一つの形へ統合されている状態です。ばらついていた流れが整理され、全体像が見えやすくなっています。",
    "down": "統合が途中で、要素がまだ分かれている状態です。今は一つにまとめる前に、それぞれの役割を確認する必要があります。"
  },
  {
    "card": 64,
    "up": "構造が分かれ、それぞれが別の方向へ進んでいる状態です。分離することで、必要な整理が進みやすくなっています。",
    "down": "分離が強まりすぎて、まとまりにくくなっている状態です。今は距離を置くことと断絶することの違いを見極める必要があります。"
  },
  {
    "card": 65,
    "up": "エネルギーや影響力が高まり、状態が強くなっている段階です。力をうまく使えれば、流れを前へ動かしやすくなります。",
    "down": "影響力が弱まりつつあり、力の出方が控えめになっている状態です。今は無理に強めるより、消耗を整えることが大切です。"
  },
  {
    "card": 66,
    "up": "力が少し弱まり、自然に調整されている状態です。強すぎた流れが落ち着き、無理のない状態へ戻りつつあります。",
    "down": "力が大きく低下し、動きにくさが出やすい状態です。今は前へ進むより、まず回復と安定を優先する必要があります。"
  },
  {
    "card": 67,
    "up": "流れが一時停止し、状況を確認する時間が生まれている状態です。止まることで、次に動くための整理がしやすくなります。",
    "down": "停止が長引き、動き出しにくくなっている状態です。今は大きな変化より、小さな再開のきっかけを作ることが大切です。"
  },
  {
    "card": 68,
    "up": "止まっていた流れが再び動き出している状態です。完全な加速ではなくても、前へ進むための流れが戻っています。",
    "down": "再始動が遅れており、動き出す準備をしている状態です。今は焦らず、再開できる条件を整える段階です。"
  },
  {
    "card": 69,
    "up": "安定した状態が維持され、大きな変化は少ないものの落ち着いた流れが続いている状態です。安心して保てる力があります。",
    "down": "安定がやや揺れ、維持するための調整が必要な状態です。崩れているのではなく、落ち着きを保つための見直し段階です。"
  },
  {
    "card": 70,
    "up": "小さな変化が静かに続いている状態です。大きく動かなくても、細かな揺れの中で流れが少しずつ変わっています。",
    "down": "変化が止まりやすく、流れが見えにくい状態です。今は小さな変化を見落とさず、次の動きを拾うことが大切です。"
  },
  {
    "card": 71,
    "up": "感情が判断に影響しやすく、気持ちの動きが流れを左右している状態です。感じていることを丁寧に扱う必要があります。",
    "down": "感情が抑えられすぎて、本音が見えにくくなっている状態です。今は正しさより、まず何を感じているのかを確認することが大切です。"
  },
  {
    "card": 72,
    "up": "思考が強く働き、論理や整理が判断の中心になっている状態です。冷静に見極める力が働きやすくなっています。",
    "down": "思考が固まりすぎて、柔軟さが弱まりやすい状態です。今は考えの正しさだけでなく、気持ちや流れも見る必要があります。"
  },
  {
    "card": 73,
    "up": "現実的な判断が中心になり、具体的な結果や実務を意識しやすい状態です。地に足をつけて進められます。",
    "down": "現実面に偏りすぎて、余裕や柔軟さが少なくなりやすい状態です。今は結果だけでなく、気持ちの余白も大切です。"
  },
  {
    "card": 74,
    "up": "全体の流れに沿って、自然に進めている状態です。個別の力よりも、場の流れをうまく受け取れている段階です。",
    "down": "全体の流れと少しズレが出ている状態です。今は無理に合わせるより、自分の位置を確認し直す必要があります。"
  },
  {
    "card": 75,
    "up": "大きな変化の入口に立っている状態です。まだ完全には動いていませんが、次の段階へ移る準備が始まっています。",
    "down": "変化の準備段階で止まり、進むタイミングを探している状態です。今は急がず、何が整えば動けるかを見る段階です。"
  },
  {
    "card": 76,
    "up": "流れが落ち着き、安定へと収束している状態です。動きの後に整理が進み、全体が穏やかにまとまりつつあります。",
    "down": "収束が不安定で、まだ揺れが残っている状態です。今はまとめきる前に、残っている不安定さを整える必要があります。"
  },
  {
    "card": 77,
    "up": "すべての要素が統合され、一つの完成した循環としてまとまっている状態です。全体の流れが自然に成立しています。",
    "down": "統合がまだ途中で、全体を整えるための調整が必要な状態です。完成に向かう流れはありますが、少しずつ仕上げる段階です。"
  }
];

function secureRandomInt(max) {
  const array = new Uint32Array(1);
  window.crypto.getRandomValues(array);
  return array[0] % max;
}

function shuffleArray(array) {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = secureRandomInt(i + 1);
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function prepareDeck() {
  return shuffleArray(CARD_DATA.map((card, index) => {
    const appText = APP_TEXT[index] || { up: card.upright, down: card.reversed };
    const upright = secureRandomInt(2) === 0;
    return {
      ...card,
      orientation: upright ? "上向き" : "下向き",
      statusKey: upright ? "ACTIVE" : card.reversedStatus,
      comment: upright ? appText.up : appText.down,
    };
  }));
}

function formatNo(no) {
  return String(no).padStart(2, "0");
}

function createSummary(cards) {
  if (cards.length !== 3) return "3枚を抽出すると、ここに総合リーディングが表示されます。";
  const [left, center, right] = cards;
  return `起点では、${left.comment}。\n\n次に、${center.comment}。\n\n最終的に、${right.comment}。\n\nこの3枚は、関係性を断定するものではなく、現在の距離感・感情の流れ・現実面の関係の流れを観測するための結果です。`;
}

function RelationCard({ card, index }) {
  const attribute = ATTRIBUTES[card.attr];
  const status = STATUS[card.statusKey];
  const guide = GUIDE[card.statusKey];
  const position = ["左", "中央", "右"][index];

  return (
    <div className="space-y-2">
      <p className="text-center text-xl text-violet-100 font-serif">{position}</p>
      <div className={`relative rounded-[1.7rem] border border-violet-300/60 bg-gradient-to-b ${attribute.accent} from-neutral-900 to-black p-3 shadow-[0_0_28px_rgba(167,139,250,0.18)]`}>
        <div className="rounded-[1.25rem] border border-amber-300/30 bg-black/55 p-4 min-h-[520px] flex flex-col justify-between overflow-hidden">
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.35),_transparent_36%),linear-gradient(120deg,_transparent,_rgba(245,158,11,0.18),_transparent)]" />

          <div className="relative text-center">
            <p className="tracking-[0.35em] text-lg font-serif" style={{ color: "#f3d28a" }}>{attribute.name}</p>
            <div className="mx-auto mt-4 h-16 w-16 rounded-full border border-amber-300/70 flex items-center justify-center bg-white/5 text-3xl font-serif text-violet-100">
              {card.attr}
            </div>
            <p className="mt-2 text-5xl font-serif text-violet-100">{formatNo(card.no)}</p>
          </div>

          <div className="relative my-5 flex items-center justify-center">
            <div className={`h-32 w-32 rounded-full ${attribute.orb} blur-2xl opacity-25`} />
            <div className="absolute h-44 w-44 rounded-full border border-amber-300/20" />
            <div className="absolute h-28 w-28 rounded-full border border-white/10" />
            <Sparkles className="absolute h-16 w-16 text-violet-100/70" />
          </div>

          <div className="relative border-t border-amber-300/25 pt-4 text-center space-y-3">
            <p className={`font-serif text-lg ${status.tone}`}>{card.orientation}：{status.label}</p>

            <div className="rounded-xl border border-amber-300/25 bg-black/25 px-4 py-3 text-left">
              <p className="text-xs tracking-[0.18em] text-amber-200/80 mb-2 text-center">観測コメント</p>
              <p className="text-sm leading-7 text-neutral-100 text-left">{card.comment}</p>
            </div>

            <div className="rounded-xl border border-neutral-500/20 bg-black/20 px-4 py-3 text-left space-y-3 opacity-90">
              <div>
                <p className="text-xs tracking-[0.18em] text-neutral-400">判断</p>
                <p className="mt-1 text-xs leading-6 text-neutral-200">{guide?.judgment}</p>
              </div>
              <div>
                <p className="text-xs tracking-[0.18em] text-neutral-400">アドバイス</p>
                <p className="mt-1 text-xs leading-6 text-neutral-200">{guide?.advice}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <p className="text-center text-lg font-serif text-neutral-100">【{card.attr} No.{formatNo(card.no)}（<span className={status.tone}>{status.code}</span>）】</p>
    </div>
  );
}

function playTone(type = "draw") {
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) return;

  const ctx = new AudioContextClass();
  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);

  if (type === "shuffle") {
    oscillator.frequency.value = 180;
    oscillator.type = "triangle";
  } else {
    oscillator.frequency.value = 320;
    oscillator.type = "sine";
  }

  gainNode.gain.setValueAtTime(0.0001, ctx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.03, ctx.currentTime + 0.02);
  gainNode.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.45);

  oscillator.start();
  oscillator.stop(ctx.currentTime + 0.45);
}

export default function MapRelationModelApp() {
  const [deck, setDeck] = useState(() => prepareDeck());
  const [drawn, setDrawn] = useState([]);
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(true);
  const summary = useMemo(() => createSummary(drawn), [drawn]);

  function reshuffle() {
    playTone("shuffle");
    setDeck(prepareDeck());
    setDrawn([]);
  }

  function drawThree() {
    if (deck.length < 3) return;
    playTone("draw");
    const next = deck.slice(0, 3);
    const rest = deck.slice(3);
    setDeck(rest);
    setDrawn(next);
    setHistory((prev) => [{ time: new Date().toLocaleTimeString(), cards: next }, ...prev]);
  }

  return (
    <div className="min-h-screen bg-[#0b1020] text-neutral-100 overflow-hidden">
      <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_top,_rgba(167,139,250,0.22),_transparent_35%),radial-gradient(circle_at_20%_40%,_rgba(192,132,252,0.18),_transparent_28%),radial-gradient(circle_at_80%_60%,_rgba(236,233,254,0.12),_transparent_30%)]" />
      <div className="relative max-w-[1600px] mx-auto p-5 space-y-4">
        <header className="grid grid-cols-1 lg:grid-cols-[280px_1fr_420px] gap-4 items-center border-b border-violet-300/30 pb-4">
          <div className="flex items-center gap-3">
            <div className="h-14 w-14 rounded-full border border-amber-300 flex items-center justify-center text-3xl text-violet-200">✧</div>
            <div>
              <h1 className="text-4xl font-serif text-violet-100 tracking-wide">MAP</h1>
              <p className="text-xs text-amber-300/80 tracking-[0.2em]">MIND LOG PROJECT</p>
            </div>
          </div>
          <div className="text-center">
            <h2 className="text-4xl lg:text-5xl font-serif text-violet-100">MAP Relation Model</h2>
            <div className="space-y-2">
              <p className="text-xl text-violet-200/90 font-serif">— Relationship Observation System —</p>
              <p className="text-sm lg:text-base text-violet-100/90 tracking-wide">
                MAPは、状態を観測し、行動を予測するためのマインド観測システムです。
              </p>
              <p className="text-xs text-neutral-400 tracking-[0.12em]">
                NOT FORTUNE TELLING ｜ MIND OBSERVATION MODEL
              </p>
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button onClick={reshuffle} className="rounded-xl border border-violet-300/70 bg-white/5 hover:bg-amber-900/30 text-violet-100 px-5">
              <Shuffle className="mr-2 h-4 w-4" />再シャッフル
            </Button>
            <Button onClick={() => setShowHistory((v) => !v)} className="rounded-xl border border-violet-300/70 bg-white/5 hover:bg-amber-900/30 text-violet-100 px-5">
              <History className="mr-2 h-4 w-4" />履歴
            </Button>
            <Button className="rounded-xl border border-violet-300/70 bg-white/5 hover:bg-amber-900/30 text-violet-100 px-5">
              <Save className="mr-2 h-4 w-4" />ログ保存
            </Button>
          </div>
        </header>

        <main className="grid grid-cols-1 xl:grid-cols-[260px_1fr_330px] gap-4">
          <aside className="space-y-4">
            <Card className="bg-white/5 border-violet-300/40 rounded-2xl text-neutral-100">
              <CardContent className="p-4">
                <h3 className="font-serif text-xl text-violet-100 mb-4">属性（5属性）</h3>
                <div className="space-y-4">
                  {Object.entries(ATTRIBUTES).map(([key, item]) => (
                    <div key={key} className="flex items-center gap-3">
                      <div className={`h-10 w-10 rounded-full ${item.orb}/30 border border-amber-300/30 flex items-center justify-center font-serif text-violet-100`}>{key}</div>
                      <div>
                        <p className="font-serif text-violet-100">{item.name}</p>
                        <p className="text-xs text-neutral-300">{item.jp}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-violet-300/40 rounded-2xl text-neutral-100">
              <CardContent className="p-4">
                <h3 className="font-serif text-xl text-violet-100 mb-4">状態異常（8状態）</h3>
                <div className="space-y-2">
                  {Object.entries(STATUS).map(([key, item]) => (
                    <div key={key} className="flex items-center gap-3">
                      <div className={`h-9 w-9 rounded-full border ${item.border} ${item.bg} flex items-center justify-center font-serif ${item.tone}`}>{item.code}</div>
                      <div>
                        <p className={`font-serif ${item.tone}`}>{item.label}</p>
                        <p className="text-xs text-neutral-300">{item.jp}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Button onClick={drawThree} disabled={deck.length < 3} className="w-full rounded-xl py-7 text-lg bg-violet-500/70 hover:bg-violet-400 text-white border border-amber-300/60">
              <Sparkles className="mr-2 h-5 w-5" />3枚を観測する
            </Button>
          </aside>

          <section className="space-y-4">
            <div className="text-center">
              <div className="space-y-3">
              <p className="text-2xl font-serif text-amber-50">3枚のカードが、あなたの関係性の “今の状態” を観測します</p>
              <div className="max-w-4xl mx-auto rounded-2xl border border-violet-300/30 bg-black/35 px-6 py-5 text-left">
                <h3 className="text-xl font-serif text-violet-100 mb-3">観測ガイド</h3>
                <div className="space-y-3 text-neutral-200 leading-8 text-sm lg:text-base">
                  <p>① 観測したいテーマ・相手・関係性を整理してください。</p>
                  <p>② 「再シャッフル」を押し、納得いくまでカードの流れを整えてください。</p>
                  <p>③ 心が落ち着いたタイミングで「3枚を観測する」を押してください。</p>
                  <p>④ 左 → 中央 → 右 の順で、状態の流れ・感情変化・関係性推移を読み取ります。</p>
                  <p className="text-violet-200/90">※ このシステムは未来を断定するものではなく、現在の心理状態・距離感・関係の流れを観測するためのモデルです。</p>
                </div>
              </div>
            </div>
              <p className="text-sm text-neutral-400 mt-1">残りカード：{deck.length}枚 / 78枚　｜　リセットまで重複なし</p>
            </div>
            {drawn.length === 0 ? (
              <div className="min-h-[520px] rounded-3xl border border-dashed border-violet-300/30 bg-black/30 flex flex-col items-center justify-center text-center p-10">
                <Sparkles className="h-16 w-16 text-violet-200/70 mb-4" />
                <p className="text-3xl font-serif text-violet-100">Relationship Observation Ready</p>
                <p className="mt-4 text-neutral-300">「3枚を観測する」を押すと、左・中央・右にカードが表示されます。</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {drawn.map((card, index) => (
                  <RelationCard key={`${card.key}-${index}-${card.orientation}`} card={card} index={index} />
                ))}
              </div>
            )}

            <Card className="bg-black/35 border-violet-300/35 rounded-2xl text-neutral-100">
              <CardContent className="p-5">
                <h3 className="text-center text-2xl font-serif text-violet-100 mb-4">— 総合リーディング —</h3>
                <div className="whitespace-pre-line text-sm lg:text-base leading-8 text-neutral-100">
                  {summary}
                </div>
              </CardContent>
            </Card>
          </section>

          <aside className="space-y-4">
            <Card className="bg-white/5 border-violet-300/40 rounded-2xl text-neutral-100">
              <CardContent className="p-4">
                <h3 className="font-serif text-xl text-violet-100 mb-4">3枚抽出ルール</h3>
                <div className="space-y-3 text-sm leading-7 text-neutral-200">
                  <p>・78枚からランダム抽出</p>
                  <p>・リセットまで同じカードは出ません</p>
                  <p>・上向き／下向きはランダム</p>
                  <p>・下向きはカードごとの状態異常を表示</p>
                  <p>・結果は未来断定ではなく現在状態の観測です</p>
                </div>
              </CardContent>
            </Card>

            {showHistory && (
              <Card className="bg-white/5 border-violet-300/40 rounded-2xl text-neutral-100">
                <CardContent className="p-4">
                  <h3 className="font-serif text-xl text-violet-100 mb-4">観測履歴</h3>
                  {history.length === 0 ? (
                    <p className="text-sm text-neutral-300">まだ履歴はありません。</p>
                  ) : (
                    <div className="space-y-4 max-h-[420px] overflow-y-auto pr-2">
                      {history.map((item, idx) => (
                        <div key={`${item.time}-${idx}`} className="border-b border-violet-300/20 pb-3">
                          <p className="text-sm text-amber-200">{item.time}</p>
                          <div className="mt-2 space-y-1 text-sm">
                            {item.cards.map((card) => {
                              const status = STATUS[card.statusKey];
                              return (
                                <p key={`${item.time}-${card.key}`}>
                                  【{card.attr} No.{formatNo(card.no)}（<span className={status.tone}>{status.code}</span>）】
                                </p>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            <Card className="bg-white/5 border-violet-300/40 rounded-2xl text-neutral-100">
              <CardContent className="p-4 text-center">
                <BookOpen className="mx-auto h-8 w-8 text-violet-200 mb-3" />
                <h3 className="font-serif text-2xl text-violet-100">Mind Log</h3>
                <p className="mt-2 text-xs tracking-[0.18em] text-amber-200/80">Observe. Understand. Transform.</p>
                <Button onClick={reshuffle} className="mt-5 rounded-xl border border-violet-300/60 bg-white/5 hover:bg-amber-900/30 text-violet-100">
                  <RotateCcw className="mr-2 h-4 w-4" />リセットして再観測
                </Button>
              </CardContent>
            </Card>
          </aside>
        </main>
      </div>
    </div>
  );
}
