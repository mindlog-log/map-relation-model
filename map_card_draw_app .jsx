import React, { useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, History, RotateCcw, Save, Shuffle, Sparkles } from "lucide-react";

const STATUS = {
  ACTIVE: { code: "A", label: "ACTIVE", jp: "正常循環", tone: "text-emerald-300", bg: "bg-emerald-500/15", border: "border-emerald-400/40" },
  DISTORTED: { code: "D", label: "DISTORTED", jp: "歪み・すれ違い", tone: "text-amber-300", bg: "bg-amber-500/15", border: "border-amber-400/40" },
  BLOCKED: { code: "B", label: "BLOCKED", jp: "停滞・接続停止", tone: "text-sky-300", bg: "bg-sky-500/15", border: "border-sky-400/40" },
  OVERLOADED: { code: "O", label: "OVERLOADED", jp: "感情過多・暴走", tone: "text-red-300", bg: "bg-red-500/15", border: "border-red-400/40" },
  INACTIVE: { code: "I", label: "INACTIVE", jp: "気持ち低下・反応弱化", tone: "text-neutral-300", bg: "bg-neutral-500/15", border: "border-neutral-400/40" },
  UNSTABLE: { code: "U", label: "UNSTABLE", jp: "揺れ・不安定", tone: "text-violet-300", bg: "bg-violet-500/15", border: "border-violet-400/40" },
  DISPERSED: { code: "S", label: "DISPERSED", jp: "気持ち分散", tone: "text-cyan-300", bg: "bg-cyan-500/15", border: "border-cyan-400/40" },
  COLLAPSED: { code: "C", label: "COLLAPSED", jp: "関係崩壊", tone: "text-orange-300", bg: "bg-orange-500/15", border: "border-orange-400/40" },
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
  return shuffleArray(CARD_DATA.map((card) => {
    const upright = secureRandomInt(2) === 0;
    return {
      ...card,
      orientation: upright ? "正位置" : "逆位置",
      statusKey: upright ? "ACTIVE" : card.reversedStatus,
      comment: upright ? card.upright : card.reversed,
    };
  }));
}

function formatNo(no) {
  return String(no).padStart(2, "0");
}

function createSummary(cards) {
  if (cards.length !== 3) return "3枚を抽出すると、ここに総合リーディングが表示されます。";
  const [left, center, right] = cards;
  return `起点では、${left.comment}。\n\n次に、${center.comment}。\n\n最終的に、${right.comment}。\n\nこの3枚は、関係性を断定するものではなく、現在の距離感・感情の流れ・現実面の接続状態を観測するための結果です。`;
}

function RelationCard({ card, index }) {
  const attribute = ATTRIBUTES[card.attr];
  const status = STATUS[card.statusKey];
  const position = ["左", "中央", "右"][index];

  return (
    <div className="space-y-2">
      <p className="text-center text-xl text-amber-100 font-serif">{position}</p>
      <div className={`relative rounded-[1.7rem] border border-amber-400/60 bg-gradient-to-b ${attribute.accent} from-neutral-900 to-black p-3 shadow-[0_0_28px_rgba(245,158,11,0.18)]`}>
        <div className="rounded-[1.25rem] border border-amber-300/30 bg-black/55 p-4 min-h-[430px] flex flex-col justify-between overflow-hidden">
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.35),_transparent_36%),linear-gradient(120deg,_transparent,_rgba(245,158,11,0.18),_transparent)]" />
          <div className="relative text-center">
            <p className="tracking-[0.35em] text-lg font-serif" style={{ color: "#f3d28a" }}>{attribute.name}</p>
            <div className="mx-auto mt-4 h-16 w-16 rounded-full border border-amber-300/70 flex items-center justify-center bg-black/50 text-3xl font-serif text-amber-100">
              {card.attr}
            </div>
            <p className="mt-2 text-5xl font-serif text-amber-100">{formatNo(card.no)}</p>
          </div>
          <div className="relative my-5 flex-1 flex items-center justify-center">
            <div className={`h-40 w-40 rounded-full ${attribute.orb} blur-2xl opacity-25`} />
            <div className="absolute h-52 w-52 rounded-full border border-amber-300/20" />
            <div className="absolute h-36 w-36 rounded-full border border-white/10" />
            <Sparkles className="absolute h-20 w-20 text-amber-100/70" />
          </div>
          <div className="relative border-t border-amber-300/25 pt-4 text-center">
            <p className={`font-serif text-lg ${status.tone}`}>{card.orientation}：{status.label}</p>
            <p className="mt-3 text-sm leading-7 text-neutral-100">{card.comment}</p>
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
    <div className="min-h-screen bg-[#050807] text-neutral-100 overflow-hidden">
      <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_top,_rgba(245,158,11,0.25),_transparent_35%),radial-gradient(circle_at_20%_40%,_rgba(124,58,237,0.2),_transparent_28%),radial-gradient(circle_at_80%_60%,_rgba(34,197,94,0.16),_transparent_30%)]" />
      <div className="relative max-w-[1600px] mx-auto p-5 space-y-4">
        <header className="grid grid-cols-1 lg:grid-cols-[280px_1fr_420px] gap-4 items-center border-b border-amber-400/30 pb-4">
          <div className="flex items-center gap-3">
            <div className="h-14 w-14 rounded-full border border-amber-300 flex items-center justify-center text-3xl text-amber-200">✧</div>
            <div>
              <h1 className="text-4xl font-serif text-amber-100 tracking-wide">MAP</h1>
              <p className="text-xs text-amber-300/80 tracking-[0.2em]">MIND LOG PROJECT</p>
            </div>
          </div>
          <div className="text-center">
            <h2 className="text-4xl lg:text-5xl font-serif text-amber-100">MAP Relation Model</h2>
            <div className="space-y-2">
              <p className="text-xl text-amber-200/90 font-serif">— Relationship Observation System —</p>
              <p className="text-sm lg:text-base text-amber-100/90 tracking-wide">
                MAPは、状態を観測し、行動を予測するためのマインド観測システムです。
              </p>
              <p className="text-xs text-neutral-400 tracking-[0.12em]">
                NOT FORTUNE TELLING ｜ MIND OBSERVATION MODEL
              </p>
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button onClick={reshuffle} className="rounded-xl border border-amber-400/70 bg-black/40 hover:bg-amber-900/30 text-amber-100 px-5">
              <Shuffle className="mr-2 h-4 w-4" />再シャッフル
            </Button>
            <Button onClick={() => setShowHistory((v) => !v)} className="rounded-xl border border-amber-400/70 bg-black/40 hover:bg-amber-900/30 text-amber-100 px-5">
              <History className="mr-2 h-4 w-4" />履歴
            </Button>
            <Button className="rounded-xl border border-amber-400/70 bg-black/40 hover:bg-amber-900/30 text-amber-100 px-5">
              <Save className="mr-2 h-4 w-4" />ログ保存
            </Button>
          </div>
        </header>

        <main className="grid grid-cols-1 xl:grid-cols-[260px_1fr_330px] gap-4">
          <aside className="space-y-4">
            <Card className="bg-black/45 border-amber-400/40 rounded-2xl text-neutral-100">
              <CardContent className="p-4">
                <h3 className="font-serif text-xl text-amber-100 mb-4">属性（5属性）</h3>
                <div className="space-y-4">
                  {Object.entries(ATTRIBUTES).map(([key, item]) => (
                    <div key={key} className="flex items-center gap-3">
                      <div className={`h-10 w-10 rounded-full ${item.orb}/30 border border-amber-300/30 flex items-center justify-center font-serif text-amber-100`}>{key}</div>
                      <div>
                        <p className="font-serif text-amber-100">{item.name}</p>
                        <p className="text-xs text-neutral-300">{item.jp}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-black/45 border-amber-400/40 rounded-2xl text-neutral-100">
              <CardContent className="p-4">
                <h3 className="font-serif text-xl text-amber-100 mb-4">状態異常（8状態）</h3>
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

            <Button onClick={drawThree} disabled={deck.length < 3} className="w-full rounded-xl py-7 text-lg bg-amber-700/80 hover:bg-amber-600 text-white border border-amber-300/60">
              <Sparkles className="mr-2 h-5 w-5" />3枚を観測する
            </Button>
          </aside>

          <section className="space-y-4">
            <div className="text-center">
              <div className="space-y-3">
              <p className="text-2xl font-serif text-amber-50">3枚のカードが、あなたの関係性の “今の状態” を観測します</p>
              <div className="max-w-4xl mx-auto rounded-2xl border border-amber-400/30 bg-black/35 px-6 py-5 text-left">
                <h3 className="text-xl font-serif text-amber-100 mb-3">観測ガイド</h3>
                <div className="space-y-3 text-neutral-200 leading-8 text-sm lg:text-base">
                  <p>① 観測したいテーマ・相手・関係性を整理してください。</p>
                  <p>② 「再シャッフル」を押し、納得いくまでカードの流れを整えてください。</p>
                  <p>③ 心が落ち着いたタイミングで「3枚を観測する」を押してください。</p>
                  <p>④ 左 → 中央 → 右 の順で、状態の流れ・感情変化・関係性推移を読み取ります。</p>
                  <p className="text-amber-200/90">※ このシステムは未来を断定するものではなく、現在の心理状態・距離感・接続状態を観測するためのモデルです。</p>
                </div>
              </div>
            </div>
              <p className="text-sm text-neutral-400 mt-1">残りカード：{deck.length}枚 / 78枚　｜　リセットまで重複なし</p>
            </div>

            {drawn.length === 0 ? (
              <div className="min-h-[520px] rounded-3xl border border-dashed border-amber-400/30 bg-black/30 flex flex-col items-center justify-center text-center p-10">
                <Sparkles className="h-16 w-16 text-amber-200/70 mb-4" />
                <h3 className="text-3xl font-serif text-amber-100">Relationship Observation Ready</h3>
                <p className="mt-3 text-neutral-300">「3枚を観測する」を押すと、左・中央・右にカードが表示されます。</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                {drawn.map((card, index) => <RelationCard key={`${card.key}-${index}`} card={card} index={index} />)}
              </div>
            )}

            <Card className="bg-black/50 border-amber-400/40 rounded-2xl text-neutral-100">
              <CardContent className="p-6">
                <h3 className="text-center text-2xl font-serif text-amber-100 mb-4">— 総合リーディング —</h3>
                <p className="whitespace-pre-line text-lg leading-9 text-neutral-100">{summary}</p>
              </CardContent>
            </Card>
          </section>

          <aside className="space-y-4">
            <Card className="bg-black/45 border-amber-400/40 rounded-2xl text-neutral-100">
              <CardContent className="p-5">
                <h3 className="font-serif text-xl text-amber-100 mb-4">3枚抽出ルール</h3>
                <ul className="space-y-3 text-sm leading-7 text-neutral-200">
                  <li>・78枚からランダム抽出</li>
                  <li>・リセットまで同じカードは出ません</li>
                  <li>・正位置／逆位置はランダム</li>
                  <li>・逆位置はカードごとの状態異常を表示</li>
                  <li>・結果は未来断定ではなく現在状態の観測です</li>
                </ul>
              </CardContent>
            </Card>

            {showHistory && (
              <Card className="bg-black/45 border-amber-400/40 rounded-2xl text-neutral-100">
                <CardContent className="p-5">
                  <h3 className="font-serif text-xl text-amber-100 mb-4">観測履歴</h3>
                  {history.length === 0 ? (
                    <p className="text-sm text-neutral-400">まだ履歴はありません。</p>
                  ) : (
                    <div className="space-y-4 max-h-[420px] overflow-auto pr-1">
                      {history.map((item, index) => (
                        <div key={index} className="border-b border-amber-400/20 pb-3">
                          <p className="text-sm text-neutral-400 mb-2">{item.time}</p>
                          <div className="space-y-1">
                            {item.cards.map((card) => {
                              const status = STATUS[card.statusKey];
                              return <p key={card.key} className="text-sm font-serif">【{card.attr} No.{formatNo(card.no)}（<span className={status.tone}>{status.code}</span>）】</p>;
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            <Card className="bg-black/45 border-amber-400/40 rounded-2xl text-neutral-100">
              <CardContent className="p-5 text-center">
                <BookOpen className="h-10 w-10 text-amber-200 mx-auto mb-3" />
                <h3 className="text-2xl font-serif text-amber-100">Mind Log</h3>
                <p className="text-xs text-amber-200/80 mt-1 tracking-[0.15em]">Observe. Understand. Transform.</p>
                <Button onClick={reshuffle} className="mt-5 w-full rounded-xl bg-black/50 border border-amber-400/50 text-amber-100 hover:bg-amber-900/30">
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
