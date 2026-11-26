// Country sections follow the compilation's scene order. Their boundaries are regions, not travel dates.
const filmItineraries = [
  {
    countryId: 'la', sourceVideoId: 'B5R5y_Y-XY0', durationSeconds: 13066,
    intro: "비엔티안에서 빠뚜싸이를 둘러본 뒤 팍세로 향해요. 루앙프라방의 탁발과 방비엥의 블루라군도 영상에 담겨 있어요.",
    sections: [
      { title: "비엔티안", stops: [
        { id: "scene-48", name: "왓타이 국제공항 도착", mapName: "Wattay International Airport, Vientiane, Laos", seconds: 48 },
        { id: "scene-773", name: "왓 옹뜨", seconds: 773, local: "Wat Ong Teu Mahawihan", kind: "명소", coords: [17.9656, 102.6038] },
        { id: "scene-817", name: "빠뚜싸이", seconds: 817, local: "Patuxai", kind: "명소", coords: [17.97055556, 102.61861111] }
      ] },
      { title: "팍세와 볼라벤 고원", mapArea: "Bolaven Plateau, Laos", stops: [
        { id: "scene-2725", name: "팍세 대불 사원", mapArea: "Pakse, Laos", seconds: 2725 },
        { id: "scene-4210", name: "탓판 폭포", mapName: "Tad Fane Waterfall, Laos", seconds: 4210 },
        { id: "scene-4834", name: "볼라벤 커피 농장", seconds: 4834 }
      ] },
      { title: "참파삭", stops: [
        { id: "scene-5529", name: "왓푸", seconds: 5529, local: "Vat Phou", kind: "명소", coords: [14.84833333, 105.82222222] }
      ] },
      { title: "루앙프라방", stops: [
        { id: "scene-7106", name: "루앙프라방 탁발 참여", seconds: 7106 },
        { id: "scene-8519", name: "꽝시 폭포", seconds: 8519, local: "Kuang Si Falls", kind: "명소", coords: [19.74916667, 101.99166667] },
        { id: "scene-9741", name: "왓 씨엥통", seconds: 9741, local: "Wat Xieng Thong", kind: "명소", coords: [19.8975, 102.14305556] }
      ] },
      { title: "방비엥", stops: [
        { id: "scene-10174", name: "방비엥 강변", seconds: 10174 },
        { id: "scene-10976", name: "방비엥 모닝 마켓", mapName: "Vang Vieng Morning Market, Laos", seconds: 10976 },
        { id: "scene-11047", name: "블루라군 2", mapName: "Blue Lagoon 2, Vang Vieng, Laos", seconds: 11047 },
        { id: "scene-11231", name: "블루라군 3", mapName: "Blue Lagoon 3, Vang Vieng, Laos", seconds: 11231 },
        { id: "scene-11302", name: "탐짱 동굴", mapName: "Tham Chang Cave, Vang Vieng, Laos", seconds: 11302 }
      ] }
    ],
    notes: [
      { seconds: 4, kind: "여행 팁", text: "출국할 때 스마트패스를 이용하는 방법을 소개해요." },
      { seconds: 137, kind: "여행 팁", text: "공항에서 인드라이브 앱으로 택시를 불렀어요.", stopId: "scene-48" },
      { seconds: 253, kind: "여행 팁", text: "기차표 예매 시점과 여행사를 통한 구매 방법을 이야기해요." },
      { seconds: 2317, kind: "여행 이야기", text: "비엔티안에서 팍세까지 비행기를 타고 이동했어요." },
      { seconds: 4834, kind: "음식", text: "볼라벤의 커피 농장에서 커피를 살펴보고 직접 마셔요.", stopId: "scene-4834" },
      { seconds: 8508, kind: "당시 비용", text: "촬영 당시 꽝시 폭포의 외국인 입장료는 6만 킵이었어요.", stopId: "scene-8519" },
      { seconds: 9400, kind: "여행 팁", text: "루앙프라방 도심을 걸어서 둘러본 경험을 들려줘요." },
      { seconds: 11047, kind: "당시 비용", text: "촬영 당시 블루라군 2의 입장료는 2만 킵이었어요.", stopId: "scene-11047" }
    ]
  },
  {
    countryId: 'kz', sourceVideoId: 'WvT9OsoCM74', durationSeconds: 10165,
    intro: "알마티 그린 바자르와 아르바트 거리를 걷고, 콕토베 전망대에서 도시를 내려다봐요. 젠코프 대성당과 민속 악기 박물관도 들러요.",
    sections: [
      { title: "알마티", stops: [
        { id: "scene-81", name: "알마티 공항 도착", mapName: "Almaty International Airport, Kazakhstan", seconds: 81 },
        { id: "scene-444", name: "알마티 그린 바자르", mapName: "Green Bazaar, Almaty, Kazakhstan", seconds: 444 },
        { id: "scene-1009", name: "알마티 아르바트 거리", mapName: "Arbat, Almaty, Kazakhstan", seconds: 1009 },
        { id: "scene-1505", name: "콕토베 전망대", seconds: 1505, local: "Köktöbe (hill)", kind: "명소", coords: [43.23305556, 76.97611111] },
        { id: "scene-2488", name: "젠코프 대성당", seconds: 2488, local: "Ascension Cathedral, Almaty", kind: "명소", coords: [43.258789, 76.95316] },
        { id: "scene-2730", name: "카자흐 민속 악기 박물관", seconds: 2730, local: "Kazakh Museum of Folk Musical Instruments", kind: "박물관", coords: [43.25944444, 76.95694444] }
      ] }
    ],
    notes: [
      { seconds: 386, kind: "여행 팁", text: "알마티 여행을 시작하며 현지 유심을 구입해요." },
      { seconds: 1414, kind: "당시 비용", text: "촬영 당시 콕토베 전망대행 곤돌라 요금을 1인당 약 1만 5천 원으로 소개해요.", stopId: "scene-1505" },
      { seconds: 1987, kind: "여행 팁", text: "길에서 부른 택시와 얀덱스 앱의 요금을 비교해요." },
      { seconds: 2524, kind: "여행 이야기", text: "젠코프 대성당을 둘러보며 나무로 지은 성당이라고 소개해요.", stopId: "scene-2488" },
      { seconds: 2751, kind: "당시 비용", text: "촬영 당시 카자흐 민속 악기 박물관 입장료는 500텡게였어요.", stopId: "scene-2730" },
      { seconds: 3811, kind: "여행 팁", text: "알마티에서 비슈케크로 가는 버스를 타고 국경에서는 걸어서 이동해요." }
    ]
  },
  {
    countryId: 'kg', sourceVideoId: 'WvT9OsoCM74', durationSeconds: 10165,
    intro: "비슈케크의 시장과 광장에서 시작해 이식쿨 호숫가와 촐폰아타의 암각화를 만나고 알라아르차 국립공원으로 향해요.",
    sections: [
      { title: "비슈케크", stops: [
        { id: "scene-5015", name: "비슈케크 오시 바자르", seconds: 5015, local: "Osh Bazaar", kind: "시장", coords: [42.875, 74.57] },
        { id: "scene-5678", name: "알라투 광장", seconds: 5678, local: "Ala-Too Square", kind: "명소", coords: [42.87638889, 74.60388889] },
        { id: "scene-5828", name: "비슈케크 승리 광장", seconds: 5828, local: "Victory Square, Bishkek", kind: "명소", coords: [42.8793, 74.6162] },
        { id: "scene-5867", name: "비슈케크 뉴 모스크", seconds: 5867, local: "Bishkek Central Mosque", kind: "명소", coords: [42.8836, 74.6201] }
      ] },
      { title: "이식쿨과 촐폰아타", mapArea: "Cholpon Ata, Kyrgyzstan", stops: [
        { id: "scene-6836", name: "이식쿨 호수 방문", mapArea: "Lake Issyk-Kul, Kyrgyzstan", seconds: 6836 },
        { id: "scene-8242", name: "촐폰아타 야외 암각화 박물관", mapName: "Petroglyphs Museum, Cholpon Ata, Kyrgyzstan", seconds: 8242 }
      ] },
      { title: "알라아르차", mapArea: "Ala Archa National Park, Kyrgyzstan", stops: [
        { id: "scene-9876", name: "알라아르차 국립공원 입장", seconds: 9876 }
      ] }
    ],
    notes: [
      { seconds: 4500, kind: "음식", text: "비슈케크에서 면 요리인 라그만을 주문해 맛봐요." },
      { seconds: 9873, kind: "당시 비용", text: "촬영 당시 알라아르차 국립공원에 들어가며 700솜을 냈어요. 영상에서는 인원당 요금인지 차량당 요금인지 확인하기 어려워요.", stopId: "scene-9876" }
    ]
  },
  {
    countryId: 'uz', sourceVideoId: 'dgwFC36E9eQ', durationSeconds: 10144,
    intro: "키르기스스탄 오시에서 국경을 건너 안디잔으로 들어가요. 타슈켄트의 시장, 부하라 구시가지, 사마르칸트의 레기스탄 광장이 차례로 나와요.",
    sections: [
      { title: "입국 전 · 키르기스스탄 오시", mapArea: "Osh, Kyrgyzstan", stops: [
        { id: "scene-41", name: "오시 공항 도착", mapName: "Osh International Airport, Kyrgyzstan", seconds: 41 }
      ] },
      { title: "국경과 안디잔", mapArea: "Andijan, Uzbekistan", stops: [
        { id: "scene-613", name: "키르기스스탄·우즈베키스탄 국경 통과", seconds: 613 },
        { id: "scene-970", name: "안디잔 시장", seconds: 970 }
      ] },
      { title: "타슈켄트", stops: [
        { id: "scene-2692", name: "아미르 티무르 박물관", seconds: 2692, local: "Amir Timur Museum", kind: "박물관", coords: [41.31361111, 69.27888889] },
        { id: "scene-4008", name: "초르수 바자르", seconds: 4008, local: "Chorsu Bazaar", kind: "시장", coords: [41.32666667, 69.235] },
        { id: "scene-4677", name: "타슈켄트 매직 시티", mapName: "Magic City, Tashkent, Uzbekistan", seconds: 4677 }
      ] },
      { title: "부하라", stops: [
        { id: "scene-5665", name: "부하라 아르크 성", seconds: 5665, local: "Ark of Bukhara", kind: "명소", coords: [39.77777778, 64.41027778] },
        { id: "scene-6025", name: "칼란 미나레트 일대", seconds: 6025, local: "Po-i-Kalyan", kind: "명소", coords: [39.77583333, 64.41416667] },
        { id: "scene-6602", name: "라비하우즈", seconds: 6602, local: "Lab-i Hauz", kind: "명소", coords: [39.77305556, 64.42027778] }
      ] },
      { title: "사마르칸트", stops: [
        { id: "scene-7730", name: "비비하눔 모스크", seconds: 7730, local: "Bibi-Khanym Mosque", kind: "명소", coords: [39.66055556, 66.97916667] },
        { id: "scene-7796", name: "레기스탄 광장", seconds: 7796, local: "Registan", kind: "명소", coords: [39.65472222, 66.97555556], sceneSummary: "영상에서는 비비하눔 모스크에서 약 10분을 걸어 레기스탄 광장에 도착해요." }
      ] }
    ],
    notes: [
      { seconds: 733, kind: "여행 팁", text: "국경을 건넌 뒤 유심을 사면서 여권을 보여줘요." },
      { seconds: 1493, kind: "여행 팁", text: "타슈켄트행 기차를 탈 때 여권과 승차권을 제시하고 보안검색을 받아요." },
      { seconds: 4739, kind: "당시 비용", text: "촬영 당시에는 타슈켄트 매직 시티에 무료로 입장했어요.", stopId: "scene-4677" },
      { seconds: 5485, kind: "음식", text: "부하라 숙소에서 빵에 카이막을 곁들여 먹어요." },
      { seconds: 6667, kind: "여행 팁", text: "부하라 구시가지에서 주요 명소를 걸어서 둘러본 경험을 소개해요.", stopId: "scene-6602" },
      { seconds: 7689, kind: "여행 팁", text: "사마르칸트에서 현장 택시 요금과 얀덱스 앱 요금을 비교해요." }
    ]
  },
  {
    countryId: 'tj', sourceVideoId: 'dgwFC36E9eQ', durationSeconds: 10144,
    intro: "우즈베키스탄 여행에 이어 두샨베에 도착해요. 식물원과 이스모일 소모니 동상을 둘러보고, 현지인의 안내로 마을버스를 타고 시장에 가요.",
    sections: [
      { title: "두샨베", stops: [
        { id: "scene-8521", name: "두샨베 도착", seconds: 8521 },
        { id: "scene-9185", name: "두샨베 식물원", mapName: "Botanical Garden, Dushanbe, Tajikistan", seconds: 9185 },
        { id: "scene-9200", name: "이스모일 소모니 동상", mapName: "Ismail Somoni Monument, Dushanbe, Tajikistan", seconds: 9200 },
        { id: "scene-9465", name: "두샨베 시장", seconds: 9465, sceneSummary: "현지인의 안내로 마을버스를 타고 두샨베 시장에 도착해요." }
      ] }
    ],
    notes: [
      { seconds: 8642, kind: "여행 팁", text: "두샨베의 은행에서 환전한 경험을 들려줘요." },
      { seconds: 9404, kind: "여행 이야기", text: "현지인의 안내를 받아 마을버스를 타고 두샨베 시장으로 가요.", stopId: "scene-9465" }
    ]
  },
  {
    countryId: 'ge', sourceVideoId: 'Swz7ZOQlIDY', durationSeconds: 12877,
    intro: "조지아 동부의 수도원에서 시작해 트빌리시 구시가지를 둘러봐요. 카즈베기의 산길을 지나 쿠타이시와 바투미까지 이어지는 여행이에요.",
    sections: [
      { title: "조지아 동부", stops: [
        { id: "scene-493", name: "보드베 수도원", seconds: 493, local: "Bodbe Monastery", kind: "명소", coords: [41.6066, 45.9334] },
        { id: "scene-2444", name: "알라베르디 수도원", seconds: 2444, local: "Alaverdi Monastery", kind: "명소", coords: [42.032497, 45.377108] },
        { id: "scene-2554", name: "이칼토 수도원", seconds: 2554, local: "Ikalto Monastery", kind: "명소", coords: [41.937, 45.381] }
      ] },
      { title: "트빌리시", stops: [
        { id: "scene-3952", name: "트빌리시 성삼위일체 대성당", seconds: 3952, local: "Holy Trinity Cathedral of Tbilisi", kind: "명소", coords: [41.6975, 44.81666667] },
        { id: "scene-4473", name: "평화의 다리", seconds: 4473, local: "Bridge of Peace", kind: "명소", coords: [41.6929, 44.8082] },
        { id: "scene-4589", name: "시오니 대성당", seconds: 4589, local: "Tbilisi Sioni Cathedral", kind: "명소", coords: [41.6914, 44.8075] },
        { id: "scene-5836", name: "조지아 어머니상", seconds: 5836, local: "Kartlis Deda", kind: "명소", coords: [41.68805556, 44.80458333] },
        { id: "scene-5904", name: "나리칼라 요새", seconds: 5904, local: "Narikala", kind: "명소", coords: [41.68777778, 44.80861111], sceneSummary: "조지아 어머니상을 본 뒤 걸어서 요새로 올라가는 장면이 이어져요." }
      ] },
      { title: "진발리와 카즈베기", mapArea: "Kazbegi Municipality, Georgia", stops: [
        { id: "scene-6053", name: "진발리 저수지 전망", mapArea: "Zhinvali Reservoir, Georgia", seconds: 6053 },
        { id: "scene-6119", name: "아나누리 성", seconds: 6119, local: "Ananuri", kind: "명소", coords: [42.16361111, 44.70388889] },
        { id: "scene-6483", name: "게르게티 성삼위일체 교회", seconds: 6483, local: "Gergeti Trinity Church", kind: "명소", coords: [42.6625, 44.62027778] },
        { id: "scene-7356", name: "카즈베기 트레킹 중 호수", seconds: 7356 }
      ] },
      { title: "쿠타이시", stops: [
        { id: "scene-9339", name: "바그라티 대성당", seconds: 9339, local: "Bagrati Cathedral", kind: "명소", coords: [42.2773, 42.7043] }
      ] },
      { title: "바투미", stops: [
        { id: "scene-10456", name: "바투미 유럽 광장", mapName: "Europe Square, Batumi, Georgia", seconds: 10456 },
        { id: "scene-10899", name: "알파벳 타워", seconds: 10899, local: "Alphabetic Tower", kind: "명소", coords: [41.65594, 41.63944] },
        { id: "scene-10951", name: "알리와 니노 조각상", mapName: "Ali and Nino, Batumi, Georgia", seconds: 10951 },
        { id: "scene-11035", name: "바투미 피아자 광장", seconds: 11035, local: "Batumi Piazza", kind: "명소", coords: [41.64961111, 41.64113889] },
        { id: "scene-11311", name: "바투미 돌고래 공연장", mapName: "Batumi Dolphinarium, Batumi, Georgia", seconds: 11311 }
      ] }
    ],
    notes: [
      { seconds: 11, kind: "여행 팁", text: "아제르바이잔에서 조지아 국경까지 콜택시로 이동해요." },
      { seconds: 1978, kind: "음식", text: "치즈를 넣은 조지아 빵 하차푸리를 주문해 맛봐요." },
      { seconds: 2802, kind: "여행 이야기", text: "현지 가정에서 포도 재배와 와인 문화 이야기를 들어요." },
      { seconds: 3021, kind: "여행 팁", text: "텔라비 주변 수도원들을 둘러볼 때 대중교통과 택시 이동을 비교해요." },
      { seconds: 4385, kind: "여행 팁", text: "트빌리시에서 환전소마다 환율이 달랐던 경험을 이야기해요." },
      { seconds: 5644, kind: "여행 팁", text: "나리칼라 요새 방면으로 올라갈 때 케이블카를 이용해요.", stopId: "scene-5904" },
      { seconds: 6483, kind: "여행 이야기", text: "산에 있는 게르게티 성삼위일체 교회를 찾아가요.", stopId: "scene-6483" },
      { seconds: 11311, kind: "여행 이야기", text: "바투미 돌고래 공연장에서 공연을 관람해요.", stopId: "scene-11311" }
    ]
  },
  {
    countryId: 'am', sourceVideoId: 'owuNJfzrino', durationSeconds: 3127,
    intro: "예레반의 공화국 광장과 현지 시장을 둘러봐요. 도시를 벗어나 가르니 신전과 게가르드 수도원을 방문한 뒤 세반 호수와 딜리잔으로 향해요.",
    sections: [
      { title: "예레반", stops: [
        { id: "scene-137", name: "예레반 공화국 광장", seconds: 137, local: "Republic Square, Yerevan", kind: "명소", coords: [40.17777778, 44.51277778] },
        { id: "scene-811", name: "예레반 승리 공원", seconds: 811, local: "Victory Park, Yerevan", kind: "공원", coords: [40.19583333, 44.51972222] },
        { id: "scene-876", name: "예레반 현지 시장", seconds: 876 }
      ] },
      { title: "가르니와 게가르드", stops: [
        { id: "scene-1606", name: "가르니 신전", seconds: 1606, local: "Garni Temple", kind: "명소", coords: [40.112421, 44.730277] },
        { id: "scene-1755", name: "게가르드 수도원", seconds: 1755, local: "Geghard", kind: "명소", coords: [40.140425, 44.818511] }
      ] },
      { title: "세반 호수", mapArea: "Lake Sevan, Armenia", stops: [
        { id: "scene-1856", name: "세반 호수 방문", seconds: 1856 },
        { id: "scene-2007", name: "세반 호수 언덕의 교회", seconds: 2007 }
      ] },
      { title: "딜리잔", mapArea: "Dilijan, Armenia", stops: [
        { id: "scene-2028", name: "딜리잔 구시가지", seconds: 2028 }
      ] }
    ],
    notes: [
      { seconds: 424, kind: "여행 팁", text: "예레반에서 얀덱스 앱으로 부른 택시 요금과 현장 요금을 비교해요." },
      { seconds: 558, kind: "음식", text: "치즈가 들어간 빵 하차푸리를 맛봐요." },
      { seconds: 821, kind: "여행 이야기", text: "예레반을 둘러보며 공공 음수대를 발견해요.", stopId: "scene-811" },
      { seconds: 917, kind: "음식", text: "현지 시장에서 와인을 시음한 뒤 구입해요.", stopId: "scene-876" },
      { seconds: 1657, kind: "음식", text: "가르니 신전을 둘러본 뒤 화덕에서 빵을 굽는 모습을 봐요.", stopId: "scene-1606" },
      { seconds: 1856, kind: "여행 이야기", text: "세반 호숫가에서 주변 풍경을 둘러봐요.", stopId: "scene-1856" },
      { seconds: 2413, kind: "음식", text: "현지인과 아르메니아 전통 빵 라바시에 관해 이야기해요." }
    ]
  },
  {
    countryId: 'az', sourceVideoId: '6FyklV4o2-8', durationSeconds: 6069,
    intro: "바쿠에서는 시르반샤 궁전과 메이든 타워를 보고, 야실 바자르에 들러요. 이어지는 셰키 여행에서는 현지 시장을 찾아가요.",
    sections: [
      { title: "바쿠", stops: [
        { id: "scene-821", name: "시르반샤 궁전", seconds: 821, local: "Palace of the Shirvanshahs", kind: "명소", coords: [40.366149, 49.833443] },
        { id: "scene-1030", name: "메이든 타워", seconds: 1030, local: "Maiden Tower (Baku)", kind: "명소", coords: [40.3661, 49.8372] },
        { id: "scene-1669", name: "플레임 타워", seconds: 1669, local: "Flame Towers", kind: "명소", coords: [40.35944444, 49.82666667] },
        { id: "scene-1691", name: "하이랜드 파크", mapName: "Highland Park, Baku, Azerbaijan", seconds: 1691 },
        { id: "scene-1941", name: "야실 바자르", mapName: "Yashil Bazaar, Baku, Azerbaijan", seconds: 1941 },
        { id: "scene-2318", name: "헤이다르 모스크", seconds: 2318, local: "Heydar Mosque", kind: "명소", coords: [40.4292, 49.8244] },
        { id: "scene-2570", name: "헤이다르 알리예프 센터", seconds: 2570, local: "Heydar Aliyev Center", kind: "명소", coords: [40.39527778, 49.86694444], sceneSummary: "헤이다르 모스크를 둘러본 뒤 콜택시를 타고 이동해요." }
      ] },
      { title: "셰키", mapArea: "Sheki, Azerbaijan", stops: [
        { id: "scene-4185", name: "셰키 도착", seconds: 4185 },
        { id: "scene-5223", name: "셰키 시장 방문", seconds: 5223 }
      ] }
    ],
    notes: [
      { seconds: 49, kind: "여행 팁", text: "환승할 때 터미널 이동과 수하물을 다시 부치는 데 걸리는 시간을 이야기해요." },
      { seconds: 457, kind: "당시 비용", text: "바쿠에서 유심 가격을 알아보고 흥정한 경험을 들려줘요." },
      { seconds: 840, kind: "당시 비용", text: "시르반샤 궁전을 방문하며 당시 입장료를 소개해요.", stopId: "scene-821" },
      { seconds: 1900, kind: "여행 팁", text: "바쿠 시내에서 택시 앱으로 차를 불러 시장으로 가요." },
      { seconds: 2505, kind: "여행 팁", text: "헤이다르 모스크에 들어갈 때 옷차림과 머리 가림에 관한 안내를 받아요.", stopId: "scene-2318" },
      { seconds: 2545, kind: "당시 비용", text: "촬영 당시 택시로 약 30분 이동하고 약 2,400원을 냈다고 이야기해요." },
      { seconds: 3636, kind: "여행 팁", text: "바쿠로 돌아가는 기차를 타면서 당시 운임을 소개해요." },
      { seconds: 5130, kind: "당시 비용", text: "촬영 당시 셰키 시내에서 택시 요금으로 약 750원을 냈다고 소개해요." }
    ]
  },
];
