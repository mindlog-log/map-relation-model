import React, { useMemo, useState } from "react";
import "./style.css";

const STATUS = {
  ACTIVE: { code: "A", label: "ACTIVE", jp: "自然に流れている", className: "active" },
  DISTORTED: { code: "D", label: "DISTORTED", jp: "見え方がずれている", className: "distorted" },
  BLOCKED: { code: "B", label: "BLOCKED", jp: "流れが止まりやすい", className: "blocked" },
  OVERLOADED: { code: "O", label: "OVERLOADED", jp: "気持ちや負荷が強い", className: "overloaded" },
  INACTIVE: { code: "I", label: "INACTIVE", jp: "反応が弱まっている", className: "inactive" },
  UNSTABLE: { code: "U", label: "UNSTABLE", jp: "揺れやすい", className: "unstable" },
  DISPERSED: { code: "S", label: "DISPERSED", jp: "意識が分散している", className: "dispersed" },
  COLLAPSED: { code: "C", label: "COLLAPSED", jp: "形が崩れやすい", className: "collapsed" }
};

const ATTRIBUTES = {
  M: { name: "MIND", jp: "内面・本音・関係意識", className: "mind" },
  D: { name: "DRIVE", jp: "接近・行動・推進力", className: "drive" },
  E: { name: "EMOTION", jp: "感情・共感・温度感", className: "emotion" },
  T: { name: "THINKING", jp: "認識・解釈・思考", className: "thinking" },
  R: { name: "REALITY", jp: "現実関係・距離・進展", className: "reality" }
};

const CARD_DATA = [
  {
    "index": 0,
    "key": "M00",
    "attr": "M",
    "no": 0,
    "reversedStatus": "UNSTABLE",
    "up": "これから物事が始まろうとしており、可能性がまだ柔らかく広がっている状態です。方向は固定されていませんが、自然に動き出せる余白があります。",
    "down": "始まりの気配はあるものの、まだ方向が定まりきっていない状態です。無理に動くより、まず流れが見えてくるのを待つ段階です。"
  },
  {
    "index": 1,
    "key": "M01",
    "attr": "M",
    "no": 1,
    "reversedStatus": "UNSTABLE",
    "up": "内側に意志が生まれ、行動の方向性が少しずつはっきりしていく状態です。自分から動き出す力が整い始めています。",
    "down": "意志はあるものの、まだ力がまとまりきっていない状態です。方向を急いで決めるより、何をしたいのかを整理する必要があります。"
  },
  {
    "index": 2,
    "key": "M02",
    "attr": "M",
    "no": 2,
    "reversedStatus": "DISTORTED",
    "up": "外からの情報や気配を自然に受け取り、落ち着いて観察できている状態です。判断を急がず、必要なものを見極められます。",
    "down": "情報が多すぎたり少なすぎたりして、受け取り方が不安定になりやすい状態です。今は一度整理し、確かな情報を選ぶことが大切です。"
  },
  {
    "index": 3,
    "key": "M03",
    "attr": "M",
    "no": 3,
    "reversedStatus": "UNSTABLE",
    "up": "感情と現実が結びつき、何かを形にしやすい創造的な状態です。内側にあるものが自然に外へ表れやすくなっています。",
    "down": "イメージや気持ちはあるものの、まだ形にしきれていない状態です。焦って完成させるより、流れがまとまる時間が必要です。"
  },
  {
    "index": 4,
    "key": "M04",
    "attr": "M",
    "no": 4,
    "reversedStatus": "OVERLOADED",
    "up": "基盤が安定し、現実をしっかり支えられている状態です。落ち着いた力で維持や管理がしやすくなっています。",
    "down": "安定の土台が少し揺らぎやすく、整え直しが必要な状態です。無理に進めるより、足元を確認することが大切です。"
  },
  {
    "index": 5,
    "key": "M05",
    "attr": "M",
    "no": 5,
    "reversedStatus": "DISTORTED",
    "up": "経験から学びを受け取り、意味やルールを整理できている状態です。過去の知識を今の判断に活かしやすくなっています。",
    "down": "学びや情報が断片的になり、理解がまとまりにくい状態です。今は答えを急がず、何を学んでいるのかを整理する段階です。"
  },
  {
    "index": 6,
    "key": "M06",
    "attr": "M",
    "no": 6,
    "reversedStatus": "BLOCKED",
    "up": "選択や関係性が自然に整理され、進む方向が見えやすくなっている状態です。大切なつながりや判断に向き合いやすい流れです。",
    "down": "選択に迷いがあり、気持ちや関係性の方向が定まりにくい状態です。決める前に、自分が何を大切にしたいのかを見直す必要があります。"
  },
  {
    "index": 7,
    "key": "M07",
    "attr": "M",
    "no": 7,
    "reversedStatus": "OVERLOADED",
    "up": "勢いとコントロールのバランスが取れ、前へ進みやすい状態です。目的に向かって力をまとめながら動けています。",
    "down": "勢いが弱まるか、逆に強すぎて扱いにくくなっている状態です。今は進む力と止める力のバランス調整が必要です。"
  },
  {
    "index": 8,
    "key": "M08",
    "attr": "M",
    "no": 8,
    "reversedStatus": "DISTORTED",
    "up": "感情や衝動を穏やかに整え、内側の力を落ち着いて扱えている状態です。静かな強さを保ちながら進めます。",
    "down": "感情が揺れやすく、内側を整えるのに少し時間が必要な状態です。強く抑え込むより、ゆっくり落ち着かせることが大切です。"
  },
  {
    "index": 9,
    "key": "M09",
    "attr": "M",
    "no": 9,
    "reversedStatus": "INACTIVE",
    "up": "外の流れから少し距離を取り、自分の内側を深く見つめている状態です。静かに考えることで、本質に近づきやすくなっています。",
    "down": "内側にこもりすぎて、視野が少し狭くなりやすい状態です。ひとりで抱え込みすぎず、必要なら外の視点も取り入れると流れが整います。"
  },
  {
    "index": 10,
    "key": "M10",
    "attr": "M",
    "no": 10,
    "reversedStatus": "BLOCKED",
    "up": "流れが切り替わり、新しい変化が自然に動き始めている状態です。状況の巡りが変わり、次の展開へ進みやすくなっています。",
    "down": "変化の流れはあるものの、切り替わりがゆっくり進んでいる状態です。今は無理に動かすより、変化のタイミングを見極める段階です。"
  },
  {
    "index": 11,
    "key": "M11",
    "attr": "M",
    "no": 11,
    "reversedStatus": "DISTORTED",
    "up": "感情と理性のバランスが取れ、落ち着いて判断しやすい状態です。偏りが少なく、公平に状況を見られています。",
    "down": "バランスが少し崩れ、判断が揺れやすくなっている状態です。感情と理屈のどちらかに寄りすぎていないか確認する必要があります。"
  },
  {
    "index": 12,
    "key": "M12",
    "attr": "M",
    "no": 12,
    "reversedStatus": "DISPERSED",
    "up": "一度立ち止まり、状況を見直すことで新しい視点が得られる状態です。止まること自体が整理の時間になっています。",
    "down": "止まった状態が長引き、動き出すきっかけを探している状態です。今は焦らず、見方を変えることで流れが戻りやすくなります。"
  },
  {
    "index": 13,
    "key": "M13",
    "attr": "M",
    "no": 13,
    "reversedStatus": "OVERLOADED",
    "up": "ひとつの流れが終わり、新しい流れへ移行し始めている状態です。手放すことで次の形が見えやすくなっています。",
    "down": "切り替えが途中で止まり、古い流れを手放しきれていない状態です。無理に終わらせるより、整理しながら移行する必要があります。"
  },
  {
    "index": 14,
    "key": "M14",
    "attr": "M",
    "no": 14,
    "reversedStatus": "BLOCKED",
    "up": "乱れていた流れが整い、全体が穏やかに循環し始めている状態です。調和が戻り、無理なく安定しやすくなっています。",
    "down": "流れが少し乱れ、再調整が必要な状態です。急いで整えようとするより、少しずつバランスを戻すことが大切です。"
  },
  {
    "index": 15,
    "key": "M15",
    "attr": "M",
    "no": 15,
    "reversedStatus": "OVERLOADED",
    "up": "強い欲求や動機が、前に進む力として働いている状態です。向かう先がはっきりしていれば、大きな推進力になります。",
    "down": "欲求やこだわりが強くなりすぎて、流れに偏りが出やすい状態です。何に引き寄せられているのかを見直す必要があります。"
  },
  {
    "index": 16,
    "key": "M16",
    "attr": "M",
    "no": 16,
    "reversedStatus": "COLLAPSED",
    "up": "古い構造が変わり、新しい形へ移行するための大きな転換が起きている状態です。崩れることで再構築の余地が生まれています。",
    "down": "変化が途中で止まり、切り替えに抵抗が出やすい状態です。今は壊すことより、何を整え直すのかを見極める段階です。"
  },
  {
    "index": 17,
    "key": "M17",
    "attr": "M",
    "no": 17,
    "reversedStatus": "INACTIVE",
    "up": "希望や回復の兆しが見え、未来への見通しが少しずつ開けている状態です。静かに流れを信じられる余裕が戻っています。",
    "down": "希望が見えにくく、回復のタイミングを待っている状態です。今は大きく進むより、小さな安心を積み直すことが大切です。"
  },
  {
    "index": 18,
    "key": "M18",
    "attr": "M",
    "no": 18,
    "reversedStatus": "DISTORTED",
    "up": "感覚や直感が働き、まだ曖昧な状況の中でも流れを感じ取れている状態です。はっきりしないものを急がず扱えます。",
    "down": "感覚が揺れやすく、不安や迷いが混ざりやすい状態です。今は結論を急がず、見えていることと感じていることを分ける必要があります。"
  },
  {
    "index": 19,
    "key": "M19",
    "attr": "M",
    "no": 19,
    "reversedStatus": "BLOCKED",
    "up": "迷いが減り、物事の方向性が明るく見えやすくなっている状態です。素直な力が出やすく、流れも開きやすくなっています。",
    "down": "方向性がまだ固まりきらず、明るさを感じにくい状態です。焦らず見極めることで、少しずつ見通しが戻りやすくなります。"
  },
  {
    "index": 20,
    "key": "M20",
    "attr": "M",
    "no": 20,
    "reversedStatus": "DISPERSED",
    "up": "過去と現在を整理し、新しい判断へ更新できている状態です。これまでの流れを踏まえて、次の段階へ進みやすくなっています。",
    "down": "過去の影響が残り、判断の更新が少し遅れている状態です。今は責めるより、何を整理すれば前へ進めるかを見る段階です。"
  },
  {
    "index": 21,
    "key": "M21",
    "attr": "M",
    "no": 21,
    "reversedStatus": "COLLAPSED",
    "up": "全体がまとまり、一つの流れとして完成に近づいている状態です。バラバラだった要素がつながり、安定した循環が生まれています。",
    "down": "統合がまだ途中で、全体が整いきっていない状態です。足りない部分を補いながら、少しずつ完成へ向かう段階です。"
  },
  {
    "index": 22,
    "key": "D01",
    "attr": "D",
    "no": 1,
    "reversedStatus": "DISPERSED",
    "up": "小さな行動が自然に始まり、現実に少しずつ影響が出ている状態です。無理のない一歩が流れを動かし始めています。",
    "down": "行動のきっかけがつかみにくく、少し動き出しにくい状態です。まずは小さく始められることを見つける必要があります。"
  },
  {
    "index": 23,
    "key": "D02",
    "attr": "D",
    "no": 2,
    "reversedStatus": "INACTIVE",
    "up": "行動に勢いが生まれ、流れが外へ広がっている状態です。動くことで周囲にも影響が届きやすくなっています。",
    "down": "勢いが少し弱まり、進行がゆっくりになっている状態です。今は無理に加速するより、力を整えてから進む方が安定します。"
  },
  {
    "index": 24,
    "key": "D03",
    "attr": "D",
    "no": 3,
    "reversedStatus": "OVERLOADED",
    "up": "強いエネルギーをうまく調整しながら進めている状態です。勢いを保ちつつ、必要なところで抑える力も働いています。",
    "down": "エネルギーの扱いが少し難しく、強すぎたり弱すぎたりしやすい状態です。今は力の出し方を調整することが大切です。"
  },
  {
    "index": 25,
    "key": "D04",
    "attr": "D",
    "no": 4,
    "reversedStatus": "DISTORTED",
    "up": "安定したリズムで継続できている状態です。大きな変化はなくても、積み重ねる力がしっかり働いています。",
    "down": "継続のリズムが乱れやすく、ペースが安定しにくい状態です。続けるためには、負担を減らして整える必要があります。"
  },
  {
    "index": 26,
    "key": "D05",
    "attr": "D",
    "no": 5,
    "reversedStatus": "OVERLOADED",
    "up": "選択肢を整理しながら、進む方向を見極めている状態です。迷いはあっても、判断に向かう流れは生まれています。",
    "down": "選択肢が多く、判断が止まりやすい状態です。今はすぐに決めるより、何を優先するかを整理する必要があります。"
  },
  {
    "index": 27,
    "key": "D06",
    "attr": "D",
    "no": 6,
    "reversedStatus": "DISPERSED",
    "up": "状況に合わせて柔軟に調整できている状態です。無理に押し切らず、流れに合わせて進められています。",
    "down": "調整が少し難しく、バランスが崩れやすい状態です。今は動きながら整えるより、一度流れを確認することが大切です。"
  },
  {
    "index": 28,
    "key": "D07",
    "attr": "D",
    "no": 7,
    "reversedStatus": "COLLAPSED",
    "up": "周囲の影響を受けながらも、自分の流れを保てている状態です。外の変化をうまく取り入れながら進めます。",
    "down": "外部の影響に左右されやすく、自分の流れが揺れやすい状態です。今は周囲より、自分の基準を確認する必要があります。"
  },
  {
    "index": 29,
    "key": "D08",
    "attr": "D",
    "no": 8,
    "reversedStatus": "INACTIVE",
    "up": "内側の力が高まり、自分を支える感覚が強くなっている状態です。自信を持って次の行動へ向かいやすくなっています。",
    "down": "自信が揺れやすく、内側の力が少し弱まりやすい状態です。無理に強く見せるより、まず自分を整えることが大切です。"
  },
  {
    "index": 30,
    "key": "D09",
    "attr": "D",
    "no": 9,
    "reversedStatus": "BLOCKED",
    "up": "感情が自然に動き、気持ちを表現しやすい状態です。感じたことが素直に流れへつながりやすくなっています。",
    "down": "感情が出にくかったり、逆に揺れやすかったりする状態です。今は気持ちを急いで形にせず、落ち着いて扱う必要があります。"
  },
  {
    "index": 31,
    "key": "D10",
    "attr": "D",
    "no": 10,
    "reversedStatus": "INACTIVE",
    "up": "感情を落ち着いて扱い、内側を安定させられている状態です。気持ちに飲まれず、穏やかに整えられています。",
    "down": "感情の整理が少し難しく、内側で揺れが起きやすい状態です。抑え込むより、何を感じているのかを確認することが大切です。"
  },
  {
    "index": 32,
    "key": "D11",
    "attr": "D",
    "no": 11,
    "reversedStatus": "OVERLOADED",
    "up": "思考が広がり、理解や分析が深まっている状態です。新しい視点を取り入れながら、考えを発展させやすくなっています。",
    "down": "思考が広がりすぎて、まとまりにくくなっている状態です。今は考えを増やすより、必要な情報を整理する段階です。"
  },
  {
    "index": 33,
    "key": "D12",
    "attr": "D",
    "no": 12,
    "reversedStatus": "BLOCKED",
    "up": "考えが深まり、一時的に負荷が出やすい状態です。丁寧に整理すれば、理解が深まる流れへ変わりやすくなっています。",
    "down": "考えが少しずつ整理され、重さが軽くなり始めている状態です。無理に答えを急がず、思考を整える時間が必要です。"
  },
  {
    "index": 34,
    "key": "D13",
    "attr": "D",
    "no": 13,
    "reversedStatus": "DISTORTED",
    "up": "現実とのバランスが取れ、状況に合わせた調整が進んでいる状態です。理想と現実をつなげやすくなっています。",
    "down": "現実とのズレが見えやすく、調整が必要な状態です。今は理想を押し通すより、現実に合わせて整えることが大切です。"
  },
  {
    "index": 35,
    "key": "D14",
    "attr": "D",
    "no": 14,
    "reversedStatus": "UNSTABLE",
    "up": "外部環境の影響で進行がゆっくりになっている状態です。止まっているように見えても、状況を整える時間になっています。",
    "down": "停滞が長引き、動き出すきっかけを待っている状態です。今は無理に進めるより、外側の条件が整うのを見極める必要があります。"
  },
  {
    "index": 36,
    "key": "E01",
    "attr": "E",
    "no": 1,
    "reversedStatus": "UNSTABLE",
    "up": "新しい関係やつながりが自然に生まれ始めている状態です。まだ小さくても、関係が育つ余地があります。",
    "down": "関係がまだ育ちきらず、少し距離が残っている状態です。急いで近づくより、安心してつながれる流れを作ることが大切です。"
  },
  {
    "index": 37,
    "key": "E02",
    "attr": "E",
    "no": 2,
    "reversedStatus": "DISTORTED",
    "up": "関係性が変化しながら、次の形へ進んでいる状態です。距離感や関わり方が自然に調整されつつあります。",
    "down": "関係の変化が一時的に止まり、距離感が定まりにくい状態です。今は関係を急いで決めず、流れを見守る必要があります。"
  },
  {
    "index": 38,
    "key": "E03",
    "attr": "E",
    "no": 3,
    "reversedStatus": "OVERLOADED",
    "up": "関係が安定し、落ち着いたつながりを保てている状態です。無理なく関わることで、安心感が続きやすくなっています。",
    "down": "安定が少し揺れやすく、関係の調整が必要な状態です。相手との距離感を丁寧に整えることで、流れが戻りやすくなります。"
  },
  {
    "index": 39,
    "key": "E04",
    "attr": "E",
    "no": 4,
    "reversedStatus": "DISTORTED",
    "up": "関係に動きがあり、距離感や流れが変化している状態です。揺れはありますが、変化を通して整理が進みやすくなっています。",
    "down": "関係が不安定で、距離感が揺れやすい状態です。今は反応を急がず、落ち着いて関係の流れを見ることが大切です。"
  },
  {
    "index": 40,
    "key": "E05",
    "attr": "E",
    "no": 5,
    "reversedStatus": "UNSTABLE",
    "up": "流れが加速し、状況が一気に動き出している状態です。勢いをうまく使えれば、前進しやすいタイミングです。",
    "down": "流れが少し弱まり、進行がゆっくりになっている状態です。今は焦って加速するより、次に動く準備を整える段階です。"
  },
  {
    "index": 41,
    "key": "E06",
    "attr": "E",
    "no": 6,
    "reversedStatus": "OVERLOADED",
    "up": "流れが一時的に止まり、状況を整理する時間が生まれている状態です。止まることで見直しが進みやすくなっています。",
    "down": "流れが長く止まり、動きにくさが強くなっている状態です。小さなきっかけを作ることで、少しずつ動きが戻りやすくなります。"
  },
  {
    "index": 42,
    "key": "E07",
    "attr": "E",
    "no": 7,
    "reversedStatus": "DISPERSED",
    "up": "止まっていた流れが再び動き始めている状態です。完全ではなくても、少しずつ再開する力が戻っています。",
    "down": "動き出しが遅れ、再開の準備をしている状態です。無理に進めるより、動ける条件を整えることが必要です。"
  },
  {
    "index": 43,
    "key": "E08",
    "attr": "E",
    "no": 8,
    "reversedStatus": "BLOCKED",
    "up": "内側にエネルギーが蓄積され、次に動くための力が溜まっている状態です。表には出ていなくても準備は進んでいます。",
    "down": "エネルギーが散りやすく、内側の安定が保ちにくい状態です。今は力を使うより、まず落ち着かせることが大切です。"
  },
  {
    "index": 44,
    "key": "E09",
    "attr": "E",
    "no": 9,
    "reversedStatus": "INACTIVE",
    "up": "内側にあった感情や考えが、自然に外へ流れ始めている状態です。抱えていたものを少しずつ表現しやすくなっています。",
    "down": "感情が外へ出にくく、内側に溜まりやすい状態です。無理に吐き出すより、安全に表現できる形を探す必要があります。"
  },
  {
    "index": 45,
    "key": "E10",
    "attr": "E",
    "no": 10,
    "reversedStatus": "DISTORTED",
    "up": "意識が一点に集中し、深く向き合えている状態です。余計なものが減り、必要な対象に力を注ぎやすくなっています。",
    "down": "集中が途切れやすく、意識が分散しやすい状態です。今はやることを絞り、ひとつずつ整えることが大切です。"
  },
  {
    "index": 46,
    "key": "E11",
    "attr": "E",
    "no": 11,
    "reversedStatus": "BLOCKED",
    "up": "意識が広がり、多角的に物事を見られている状態です。広い視野を持つことで、新しい気づきが生まれやすくなっています。",
    "down": "意識が広がりすぎて、まとまりにくくなっている状態です。今は視点を増やすより、必要なものを選ぶ段階です。"
  },
  {
    "index": 47,
    "key": "E12",
    "attr": "E",
    "no": 12,
    "reversedStatus": "INACTIVE",
    "up": "思考が整理され、落ち着いて判断しやすい状態です。情報を冷静に扱い、安定した答えに近づきやすくなっています。",
    "down": "思考が少し乱れ、判断が揺れやすい状態です。今は考え続けるより、情報を減らして整理することが必要です。"
  },
  {
    "index": 48,
    "key": "E13",
    "attr": "E",
    "no": 13,
    "reversedStatus": "UNSTABLE",
    "up": "情報が整理されにくいものの、少しずつ調整している状態です。混乱の中から必要なものを選び直す流れがあります。",
    "down": "混乱が落ち着き始め、整理へ向かっている状態です。まだ完全ではありませんが、少しずつ見通しを取り戻しつつあります。"
  },
  {
    "index": 49,
    "key": "E14",
    "attr": "E",
    "no": 14,
    "reversedStatus": "BLOCKED",
    "up": "直感が自然に働き、感覚的な判断を活かしやすい状態です。理屈だけでは見えない流れを感じ取りやすくなっています。",
    "down": "直感と現実のバランスが崩れやすい状態です。感じたことをすぐ決めつけず、現実と照らし合わせる必要があります。"
  },
  {
    "index": 50,
    "key": "T01",
    "attr": "T",
    "no": 1,
    "reversedStatus": "DISTORTED",
    "up": "現実的な判断がしっかり働き、具体的な行動に移しやすい状態です。実務や結果を意識しながら進められます。",
    "down": "現実面に偏りすぎて、柔軟さや感情面が置き去りになりやすい状態です。今は実務だけでなく余白も必要です。"
  },
  {
    "index": 51,
    "key": "T02",
    "attr": "T",
    "no": 2,
    "reversedStatus": "DISTORTED",
    "up": "状態が少しずつ安定へ向かい始めている段階です。まだ途中でも、流れを整え直す力が戻りつつあります。",
    "down": "安定するまで少し時間が必要な状態です。今は急いで結果を出すより、回復の流れを丁寧に保つことが大切です。"
  },
  {
    "index": 52,
    "key": "T03",
    "attr": "T",
    "no": 3,
    "reversedStatus": "OVERLOADED",
    "up": "停滞が続きながらも、内側では整理が進んでいる状態です。大きく動かなくても、次の準備をしている流れがあります。",
    "down": "停滞が長引き、動き出しにくさが強くなっている状態です。小さな変化を作ることで、流れが戻るきっかけになります。"
  },
  {
    "index": 53,
    "key": "T04",
    "attr": "T",
    "no": 4,
    "reversedStatus": "DISTORTED",
    "up": "次の変化が起こる直前で、準備が整いつつある状態です。まだ表には出ていなくても、流れは切り替わろうとしています。",
    "down": "変化のタイミングを待っている状態です。無理に動かすより、何が整えば変化できるのかを確認する段階です。"
  },
  {
    "index": 54,
    "key": "T05",
    "attr": "T",
    "no": 5,
    "reversedStatus": "DISTORTED",
    "up": "仕組みや構造そのものに変化が起きている状態です。表面的な変化ではなく、土台から流れが組み替わり始めています。",
    "down": "構造の変化が途中で止まり、調整が必要な状態です。今は無理に完成させず、どこを整えるべきかを見る段階です。"
  },
  {
    "index": 55,
    "key": "T06",
    "attr": "T",
    "no": 6,
    "reversedStatus": "INACTIVE",
    "up": "大きな変化が起き、古い安定から新しい形へ移ろうとしている状態です。揺れはありますが、再構築へ向かう流れがあります。",
    "down": "変化に混乱が伴い、整理が必要な状態です。今は崩れた部分を責めるより、新しく整える場所を見つけることが大切です。"
  },
  {
    "index": 56,
    "key": "T07",
    "attr": "T",
    "no": 7,
    "reversedStatus": "OVERLOADED",
    "up": "新しい形への再構築が始まっている状態です。まだ完成ではありませんが、整え直すための流れは動き出しています。",
    "down": "再構築の準備が進んでいる状態です。すぐに形にするより、土台を確認しながら少しずつ作り直す段階です。"
  },
  {
    "index": 57,
    "key": "T08",
    "attr": "T",
    "no": 8,
    "reversedStatus": "INACTIVE",
    "up": "動きながらも安定を保てている状態です。変化の中でもバランスを取り、無理なく流れに乗りやすくなっています。",
    "down": "動きと安定のバランスが揺れている状態です。今は進むことと整えることの両方を意識する必要があります。"
  },
  {
    "index": 58,
    "key": "T09",
    "attr": "T",
    "no": 9,
    "reversedStatus": "BLOCKED",
    "up": "流れが不安定ながらも、まだ動きは続いている状態です。揺れを含みながら、次の安定点を探している流れです。",
    "down": "流れが乱れやすく、調整が必要な状態です。今は勢いよりも、どこで乱れているのかを確認することが大切です。"
  },
  {
    "index": 59,
    "key": "T10",
    "attr": "T",
    "no": 10,
    "reversedStatus": "DISTORTED",
    "up": "可能性が外へ広がり、選択肢が増えている状態です。視野が開き、新しい方向を見つけやすくなっています。",
    "down": "可能性がまだ十分に開いておらず、選択肢が見えにくい状態です。今は外へ広げる前に、内側の準備を整える段階です。"
  },
  {
    "index": 60,
    "key": "T11",
    "attr": "T",
    "no": 11,
    "reversedStatus": "INACTIVE",
    "up": "範囲が整理され、意識や力を集中しやすくなっている状態です。余計なものが減り、必要なことに向かいやすくなっています。",
    "down": "範囲が狭まりすぎて、柔軟さが弱まりやすい状態です。今は集中と閉塞の違いを見極める必要があります。"
  },
  {
    "index": 61,
    "key": "T12",
    "attr": "T",
    "no": 12,
    "reversedStatus": "DISPERSED",
    "up": "物事や人とのつながりが生まれ、流れが結びつき始めている状態です。関係や要素が自然に接続されやすくなっています。",
    "down": "つながりがまだ弱く、距離が残っている状態です。無理に結びつけるより、安心して近づける流れを作ることが大切です。"
  },
  {
    "index": 62,
    "key": "T13",
    "attr": "T",
    "no": 13,
    "reversedStatus": "BLOCKED",
    "up": "関係や流れが整理され、必要な距離感が見え始めている状態です。切り離すことで整うものもあります。",
    "down": "つながりが途切れやすく、孤立感が出やすい状態です。今は切るか残すかより、どんな距離が必要かを見直す段階です。"
  },
  {
    "index": 63,
    "key": "T14",
    "attr": "T",
    "no": 14,
    "reversedStatus": "BLOCKED",
    "up": "複数の要素がまとまり、一つの形へ統合されている状態です。ばらついていた流れが整理され、全体像が見えやすくなっています。",
    "down": "統合が途中で、要素がまだ分かれている状態です。今は一つにまとめる前に、それぞれの役割を確認する必要があります。"
  },
  {
    "index": 64,
    "key": "R01",
    "attr": "R",
    "no": 1,
    "reversedStatus": "BLOCKED",
    "up": "構造が分かれ、それぞれが別の方向へ進んでいる状態です。分離することで、必要な整理が進みやすくなっています。",
    "down": "分離が強まりすぎて、まとまりにくくなっている状態です。今は距離を置くことと断絶することの違いを見極める必要があります。"
  },
  {
    "index": 65,
    "key": "R02",
    "attr": "R",
    "no": 2,
    "reversedStatus": "INACTIVE",
    "up": "エネルギーや影響力が高まり、状態が強くなっている段階です。力をうまく使えれば、流れを前へ動かしやすくなります。",
    "down": "影響力が弱まりつつあり、力の出方が控えめになっている状態です。今は無理に強めるより、消耗を整えることが大切です。"
  },
  {
    "index": 66,
    "key": "R03",
    "attr": "R",
    "no": 3,
    "reversedStatus": "DISTORTED",
    "up": "力が少し弱まり、自然に調整されている状態です。強すぎた流れが落ち着き、無理のない状態へ戻りつつあります。",
    "down": "力が大きく低下し、動きにくさが出やすい状態です。今は前へ進むより、まず回復と安定を優先する必要があります。"
  },
  {
    "index": 67,
    "key": "R04",
    "attr": "R",
    "no": 4,
    "reversedStatus": "OVERLOADED",
    "up": "流れが一時停止し、状況を確認する時間が生まれている状態です。止まることで、次に動くための整理がしやすくなります。",
    "down": "停止が長引き、動き出しにくくなっている状態です。今は大きな変化より、小さな再開のきっかけを作ることが大切です。"
  },
  {
    "index": 68,
    "key": "R05",
    "attr": "R",
    "no": 5,
    "reversedStatus": "UNSTABLE",
    "up": "止まっていた流れが再び動き出している状態です。完全な加速ではなくても、前へ進むための流れが戻っています。",
    "down": "再始動が遅れており、動き出す準備をしている状態です。今は焦らず、再開できる条件を整える段階です。"
  },
  {
    "index": 69,
    "key": "R06",
    "attr": "R",
    "no": 6,
    "reversedStatus": "DISTORTED",
    "up": "安定した状態が維持され、大きな変化は少ないものの落ち着いた流れが続いている状態です。安心して保てる力があります。",
    "down": "安定がやや揺れ、維持するための調整が必要な状態です。崩れているのではなく、落ち着きを保つための見直し段階です。"
  },
  {
    "index": 70,
    "key": "R07",
    "attr": "R",
    "no": 7,
    "reversedStatus": "BLOCKED",
    "up": "小さな変化が静かに続いている状態です。大きく動かなくても、細かな揺れの中で流れが少しずつ変わっています。",
    "down": "変化が止まりやすく、流れが見えにくい状態です。今は小さな変化を見落とさず、次の動きを拾うことが大切です。"
  },
  {
    "index": 71,
    "key": "R08",
    "attr": "R",
    "no": 8,
    "reversedStatus": "COLLAPSED",
    "up": "感情が判断に影響しやすく、気持ちの動きが流れを左右している状態です。感じていることを丁寧に扱う必要があります。",
    "down": "感情が抑えられすぎて、本音が見えにくくなっている状態です。今は正しさより、まず何を感じているのかを確認することが大切です。"
  },
  {
    "index": 72,
    "key": "R09",
    "attr": "R",
    "no": 9,
    "reversedStatus": "UNSTABLE",
    "up": "思考が強く働き、論理や整理が判断の中心になっている状態です。冷静に見極める力が働きやすくなっています。",
    "down": "思考が固まりすぎて、柔軟さが弱まりやすい状態です。今は考えの正しさだけでなく、気持ちや流れも見る必要があります。"
  },
  {
    "index": 73,
    "key": "R10",
    "attr": "R",
    "no": 10,
    "reversedStatus": "DISTORTED",
    "up": "現実的な判断が中心になり、具体的な結果や実務を意識しやすい状態です。地に足をつけて進められます。",
    "down": "現実面に偏りすぎて、余裕や柔軟さが少なくなりやすい状態です。今は結果だけでなく、気持ちの余白も大切です。"
  },
  {
    "index": 74,
    "key": "R11",
    "attr": "R",
    "no": 11,
    "reversedStatus": "BLOCKED",
    "up": "全体の流れに沿って、自然に進めている状態です。個別の力よりも、場の流れをうまく受け取れている段階です。",
    "down": "全体の流れと少しズレが出ている状態です。今は無理に合わせるより、自分の位置を確認し直す必要があります。"
  },
  {
    "index": 75,
    "key": "R12",
    "attr": "R",
    "no": 12,
    "reversedStatus": "OVERLOADED",
    "up": "大きな変化の入口に立っている状態です。まだ完全には動いていませんが、次の段階へ移る準備が始まっています。",
    "down": "変化の準備段階で止まり、進むタイミングを探している状態です。今は急がず、何が整えば動けるかを見る段階です。"
  },
  {
    "index": 76,
    "key": "R13",
    "attr": "R",
    "no": 13,
    "reversedStatus": "DISTORTED",
    "up": "流れが落ち着き、安定へと収束している状態です。動きの後に整理が進み、全体が穏やかにまとまりつつあります。",
    "down": "収束が不安定で、まだ揺れが残っている状態です。今はまとめきる前に、残っている不安定さを整える必要があります。"
  },
  {
    "index": 77,
    "key": "R14",
    "attr": "R",
    "no": 14,
    "reversedStatus": "OVERLOADED",
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
  return shuffleArray(CARD_DATA.map((card) => {
    const up = secureRandomInt(2) === 0;
    return {
      ...card,
      orientation: up ? "上向き" : "下向き",
      statusKey: up ? "ACTIVE" : card.reversedStatus,
      comment: up ? card.up : card.down
    };
  }));
}

function formatNo(no) {
  return String(no).padStart(2, "0");
}

function playTone(type = "draw") {
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) return;
  const ctx = new AudioContextClass();
  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();
  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);
  oscillator.frequency.value = type === "shuffle" ? 180 : 320;
  oscillator.type = type === "shuffle" ? "triangle" : "sine";
  gainNode.gain.setValueAtTime(0.0001, ctx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.035, ctx.currentTime + 0.02);
  gainNode.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.42);
  oscillator.start();
  oscillator.stop(ctx.currentTime + 0.42);
}

function createSummary(cards) {
  if (cards.length !== 3) return "3枚を抽出すると、ここに総合リーディングが表示されます。";
  const [left, center, right] = cards;
  return `起点では、${left.comment}\n\n次に、${center.comment}\n\n最終的に、${right.comment}\n\nこの3枚は、未来を断定するものではありません。現在の状態・距離感・流れを観測し、これからの行動を判断するためのヒントとして使います。`;
}

function RelationCard({ card, index }) {
  const attribute = ATTRIBUTES[card.attr];
  const status = STATUS[card.statusKey];
  const position = ["左", "中央", "右"][index];

  return (
    <div className="result-card-wrap">
      <div className="position-label">{position}</div>
      <div className={`result-card ${attribute.className}`}>
        <div className="card-top">
          <div className="attribute-name">{attribute.name}</div>
          <div className="orb">{card.attr}</div>
          <div className="card-number">{formatNo(card.no)}</div>
        </div>
        <div className="symbol-area">
          <div className="glow"></div>
          <div className="ring ring-large"></div>
          <div className="ring ring-small"></div>
          <div className="spark">✧</div>
        </div>
        <div className="card-bottom">
          <div className={`status-line ${status.className}`}>{card.orientation}｜{status.label}</div>
          <div className="status-jp">{status.jp}</div>
          <p>{card.comment}</p>
        </div>
      </div>
      <div className="code-line">【{card.attr} No.{formatNo(card.no)}（<span className={status.className}>{status.code}</span>）】</div>
    </div>
  );
}

export default function App() {
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
    setDeck(deck.slice(3));
    setDrawn(next);
    setHistory((prev) => [{ time: new Date().toLocaleTimeString(), cards: next }, ...prev]);
  }

  function saveLog() {
    const body = [
      "MAP Relation Model 観測ログ",
      `日時：${new Date().toLocaleString()}`,
      "",
      ...drawn.map((card, index) => `${["左", "中央", "右"][index]}：${card.attr} No.${formatNo(card.no)}｜${card.orientation}｜${STATUS[card.statusKey].label}\n${card.comment}`),
      "",
      "総合リーディング：",
      summary
    ].join("\n\n");
    const blob = new Blob([body], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "map_relation_observation_log.txt";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="app">
      <header className="header">
        <div className="brand">
          <div className="brand-mark">✧</div>
          <div>
            <h1>MAP</h1>
            <p>MIND LOG PROJECT</p>
          </div>
        </div>

        <div className="title-block">
          <h2>MAP Relation Model</h2>
          <p className="subtitle">— Relationship Observation System —</p>
          <p className="catch">MAPは、状態を観測し、行動を予測するためのマインド観測システムです。</p>
          <p className="not-fortune">NOT FORTUNE TELLING ｜ MIND OBSERVATION MODEL</p>
        </div>

        <div className="header-actions">
          <button onClick={reshuffle}>再シャッフル</button>
          <button onClick={() => setShowHistory((v) => !v)}>履歴</button>
          <button onClick={saveLog} disabled={drawn.length === 0}>ログ保存</button>
        </div>
      </header>

      <main className="layout">
        <aside className="side">
          <section className="panel">
            <h3>属性（5属性）</h3>
            {Object.entries(ATTRIBUTES).map(([key, item]) => (
              <div className="legend-row" key={key}>
                <span className={`legend-dot ${item.className}`}>{key}</span>
                <div><b>{item.name}</b><small>{item.jp}</small></div>
              </div>
            ))}
          </section>

          <section className="panel">
            <h3>状態異常（8状態）</h3>
            {Object.entries(STATUS).map(([key, item]) => (
              <div className="legend-row" key={key}>
                <span className={`legend-dot ${item.className}`}>{item.code}</span>
                <div><b className={item.className}>{item.label}</b><small>{item.jp}</small></div>
              </div>
            ))}
          </section>

          <button className="draw-button" onClick={drawThree} disabled={deck.length < 3}>3枚を観測する</button>
        </aside>

        <section className="center">
          <h2 className="intro">3枚のカードが、あなたの関係性の “今の状態” を観測します</h2>

          <section className="guide panel">
            <h3>観測ガイド</h3>
            <p>① 観測したいテーマ・相手・関係性を整理してください。</p>
            <p>② 「再シャッフル」を押し、納得いくまでカードの流れを整えてください。</p>
            <p>③ 心が落ち着いたタイミングで「3枚を観測する」を押してください。</p>
            <p>④ 左 → 中央 → 右 の順で、状態の流れ・感情変化・関係性推移を読み取ります。</p>
            <p className="note">※ このシステムは未来を断定するものではなく、現在の心理状態・距離感・接続状態を観測するためのモデルです。</p>
          </section>

          <div className="deck-info">残りカード：{deck.length}枚 / 78枚　｜　リセットまで重複なし</div>

          {drawn.length === 0 ? (
            <section className="ready-box">
              <div className="ready-symbol">✧</div>
              <h3>Relationship Observation Ready</h3>
              <p>「3枚を観測する」を押すと、左・中央・右にカードが表示されます。</p>
            </section>
          ) : (
            <section className="cards-grid">
              {drawn.map((card, index) => <RelationCard key={`${card.key}-${index}`} card={card} index={index} />)}
            </section>
          )}

          <section className="summary panel">
            <h3>— 総合リーディング —</h3>
            <p>{summary}</p>
          </section>
        </section>

        <aside className="side right">
          <section className="panel">
            <h3>3枚抽出ルール</h3>
            <ul>
              <li>78枚からランダム抽出</li>
              <li>リセットまで同じカードは出ません</li>
              <li>上向き／下向きはランダム</li>
              <li>下向きはカードごとの状態異常を表示</li>
              <li>結果は未来断定ではなく現在状態の観測です</li>
            </ul>
          </section>

          {showHistory && (
            <section className="panel history">
              <h3>観測履歴</h3>
              {history.length === 0 ? <p>まだ履歴はありません。</p> : history.map((item, index) => (
                <div className="history-item" key={index}>
                  <small>{item.time}</small>
                  {item.cards.map((card) => {
                    const status = STATUS[card.statusKey];
                    return <div key={card.key}>【{card.attr} No.{formatNo(card.no)}（<span className={status.className}>{status.code}</span>）】</div>;
                  })}
                </div>
              ))}
            </section>
          )}

          <section className="panel mindlog">
            <h3>Mind Log</h3>
            <p>Observe. Understand. Transform.</p>
            <button onClick={reshuffle}>リセットして再観測</button>
          </section>
        </aside>
      </main>
    </div>
  );
}