export type ScenarioType = "catchphrase" | "choice";

export interface ScenarioDisplay {
  id: number;
  type: ScenarioType;
  title: string;
  category: string;
  question: string;
  image?: string | string[];
  options?: string[];
  correctAnswer: string;
  acceptedAnswers?: string[];
  suggestion: string;
  description: string;
  philosophicalNote: string;
  wordCount?: number;
  letterHint?: string;
}

export const SCENARIOS: ScenarioDisplay[] = [
  {
    id: 1,
    type: "catchphrase",
    title: "Vòng 1: Chủ thể Quyền lực Tối cao",
    category: "Tư tưởng Hồ Chí Minh",
    question: "Theo tư tưởng Hồ Chí Minh, trong chế độ dân chủ, ai là người giữ 'địa vị cao nhất', là chủ nhân đích thực của non sông đất nước?",
    image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&auto=format&fit=crop&q=80",
    correctAnswer: "Nhân dân",
    acceptedAnswers: ["nhân dân", "nhan dan", "dân", "dan", "người dân", "nguoi dan", "toàn dân", "toan dan"],
    suggestion: "Cụm từ gồm 2 tiếng (N... D...). Lực lượng đông đảo nhất, gốc rễ của mọi quyền lực nhà nước.",
    wordCount: 2,
    letterHint: "N _ _ _  D _ _",
    description: "Hồ Chí Minh khẳng định dứt khoát: 'Nước ta là nước dân chủ, địa vị cao nhất là dân, vì dân là chủ'. Mọi chủ trương, đường lối đều phải xuất phát từ lợi ích chính đáng của nhân dân.",
    philosophicalNote: "'Dân như nước, chở thuyền là dân mà lật thuyền cũng là dân'. Nhân dân là cội nguồn sức mạnh vô địch của cách mạng.",
  },
  {
    id: 2,
    type: "choice",
    title: "Vòng 2: Nguồn gốc Thuật ngữ Dân chủ",
    category: "Lịch sử Triết học Chính trị",
    question: "Thuật ngữ 'Dân chủ' (Demokratia) ra đời vào khoảng thế kỷ VII - VI TCN tại đâu, và hợp thành từ hai từ 'Demos' (Nhân dân) và 'Kratos' mang nghĩa gì?",
    image: "https://images.unsplash.com/photo-1555993539-1732b0258235?w=800&auto=format&fit=crop&q=80",
    options: [
      "A. La Mã cổ đại · Kratos là Pháp luật thành văn",
      "B. Hy Lạp cổ đại · Kratos là Quyền lực / Cai trị",
      "C. Ai Cập cổ đại · Kratos là Tự do tín ngưỡng",
      "D. Lưỡng Hà cổ đại · Kratos là Công lý xã hội"
    ],
    correctAnswer: "B",
    suggestion: "Cái nôi của nền văn minh cổ đại Địa Trung Hải với các thị quốc Athens.",
    description: "Thuật ngữ 'Demokratia' ra đời tại Hy Lạp cổ đại (thế kỷ VII–VI TCN), kết hợp từ 'Demos' (Nhân dân) và 'Kratos' (Quyền lực / Cai trị), nghĩa là quyền lực thuộc về nhân dân.",
    philosophicalNote: "Ngay từ thời cổ đại, nhân loại đã khao khát một thể chế mà quyền lực tối cao thuộc về cộng đồng thay vì độc tài quân chủ.",
  },
  {
    id: 3,
    type: "catchphrase",
    title: "Vòng 3: Sứ mệnh của Cán bộ & Chính phủ",
    category: "Đạo đức Công vụ XHCN",
    question: "Trong chế độ dân chủ xã hội chủ nghĩa, Hồ Chí Minh ví Chính phủ và cán bộ lãnh đạo giữ vai trò là gì đối với nhân dân (không phải làm 'quan cách mạng')?",
    image: "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=800&auto=format&fit=crop&q=80",
    correctAnswer: "Người đầy tớ",
    acceptedAnswers: ["người đầy tớ", "nguoi day to", "đầy tớ", "day to", "đầy tớ của dân", "day to cua dan", "người phục vụ", "nguoi phuc vu"],
    suggestion: "Cụm từ gồm 3 tiếng (N... Đ... T...). Tận tụy, trung thành, hết lòng lo cho dân.",
    wordCount: 3,
    letterHint: "N _ _ _ _  Đ _ _  T _",
    description: "Bác dạy: 'Chính phủ là đầy tớ của dân... Dân làm chủ thì Chủ tịch, bộ trưởng cũng là đầy tớ, phục vụ nhân dân chứ không phải làm quan cách mạng đè đầu cưỡi cổ dân'.",
    philosophicalNote: "Cán bộ công quyền phải là công bộc tận tụy, 'việc gì lợi cho dân, ta phải hết sức làm. Việc gì hại đến dân, ta phải hết sức tránh'.",
  },
  {
    id: 4,
    type: "choice",
    title: "Vòng 4: Mốc Lịch sử Xác lập Nền Dân chủ XHCN",
    category: "Lịch sử Chủ nghĩa Xã hội",
    question: "Dân chủ xã hội chủ nghĩa được phôi thai từ Công xã Pari (1871), nhưng chính thức được xác lập trên phạm vi thế giới gắn liền với sự kiện lịch sử vĩ đại nào?",
    image: "https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?w=800&auto=format&fit=crop&q=80",
    options: [
      "A. Tuyên ngôn Độc lập Hoa Kỳ năm 1776",
      "B. Cách mạng Tư sản Pháp bùng nổ năm 1789",
      "C. Thắng lợi của Cách mạng Tháng Mười Nga năm 1917",
      "D. Chiến thắng phát xít kết thúc Thế chiến II năm 1945"
    ],
    correctAnswer: "C",
    suggestion: "Sự kiện lịch sử rung chuyển thế giới năm 1917, khai sinh Nhà nước Xô viết đầu tiên.",
    description: "Cách mạng Xã hội chủ nghĩa Tháng Mười Nga (1917) thành công đã chính thức xác lập nền dân chủ XHCN trên thế giới gắn liền với sự ra đời của Nhà nước Xô viết.",
    philosophicalNote: "Mở ra thời đại mới - thời đại quá độ từ chủ nghĩa tư bản lên chủ nghĩa xã hội trên phạm vi toàn cầu.",
  },
  {
    id: 5,
    type: "catchphrase",
    title: "Vòng 5: Bản chất Kinh tế XHCN",
    category: "Kinh tế Chính trị Mác - Lênin",
    question: "Khác với nền dân chủ tư sản dựa trên tư hữu tư bản, nền dân chủ XHCN thiết lập chế độ sở hữu nào đối với các tư liệu sản xuất chủ yếu?",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&auto=format&fit=crop&q=80",
    correctAnswer: "Công hữu",
    acceptedAnswers: ["công hữu", "cong huu", "chế độ công hữu", "che do cong huu", "sở hữu công cộng", "so huu cong cong", "sở hữu toàn dân", "so huu toan dan"],
    suggestion: "Từ gồm 2 tiếng (C... H...). Thuộc về toàn dân và tập thể xã hội, xóa bỏ gốc rễ của áp bức bóc lột.",
    wordCount: 2,
    letterHint: "C _ _ _  H _ _",
    description: "Bản chất kinh tế của nền dân chủ XHCN dựa trên chế độ công hữu về các tư liệu sản xuất chủ yếu, bảo đảm nhân dân làm chủ quá trình sản xuất và phân phối của cải.",
    philosophicalNote: "Chỉ khi người lao động làm chủ tư liệu sản xuất thì quyền dân chủ về chính trị mới thực chất, không còn là hình thức hay khẩu hiệu suông.",
  },
  {
    id: 6,
    type: "choice",
    title: "Vòng 6: Bản chất Chính trị của Dân chủ XHCN",
    category: "Chính trị học Mác - Lênin",
    question: "Bản chất chính trị của nền dân chủ xã hội chủ nghĩa thể hiện sự lãnh đạo của giai cấp nào thông qua Đảng tiên phong nhằm phục vụ lợi ích của ai?",
    image: "https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?w=800&auto=format&fit=crop&q=80",
    options: [
      "A. Giai cấp tư sản lãnh đạo nhằm phục vụ tầng lớp tinh hoa kinh tế",
      "B. Giai cấp công nhân lãnh đạo nhằm thực hiện quyền lực và lợi ích của toàn thể nhân dân",
      "C. Tầng lớp trí thức lãnh đạo nhằm củng cố bộ máy hành chính nhà nước",
      "D. Giai cấp nông dân lãnh đạo nhằm bảo vệ quyền lợi khu vực nông thôn"
    ],
    correctAnswer: "B",
    suggestion: "Giai cấp tiên phong mang sứ mệnh lịch sử giải phóng toàn thể xã hội.",
    description: "Sự lãnh đạo chính trị của giai cấp công nhân thông qua Đảng Cộng sản không phải để giành đặc quyền riêng, mà nhằm thực hiện quyền lực và lợi ích của toàn thể nhân dân lao động.",
    philosophicalNote: "Dân chủ XHCN vừa mang bản chất giai cấp công nhân, vừa có tính nhân dân rộng rãi và tính dân tộc sâu sắc.",
  },
  {
    id: 7,
    type: "catchphrase",
    title: "Vòng 7: Hệ tư tưởng Kim chỉ nam",
    category: "Tư tưởng & Văn hóa",
    question: "Nền dân chủ xã hội chủ nghĩa lấy hệ tư tưởng khoa học cách mạng nào làm nền tảng kim chỉ nam chủ đạo trong đời sống tinh thần xã hội?",
    image: "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=800&auto=format&fit=crop&q=80",
    correctAnswer: "Mác Lênin",
    acceptedAnswers: ["mác lênin", "mac lenin", "chủ nghĩa mác lênin", "chu nghia mac lenin", "mác - lênin", "mac - lenin", "marx lenin", "chủ nghĩa mác - lênin"],
    suggestion: "Cụm từ ghép 2 tên tuổi vĩ đại (M... - L...). Học thuyết khoa học về sự nghiệp giải phóng con người.",
    wordCount: 2,
    letterHint: "M _ _  -  L _ _ _ _",
    description: "Nền dân chủ XHCN lấy chủ nghĩa Mác - Lênin làm hệ tư tưởng chủ đạo, đồng thời kế thừa tinh hoa văn hóa truyền thống dân tộc và văn minh tiến bộ nhân loại.",
    philosophicalNote: "Hệ tư tưởng cách mạng cung cấp thế giới quan và phương pháp luận khoa học soi đường cho nhân dân tự giác xây dựng xã hội mới.",
  },
  {
    id: 8,
    type: "choice",
    title: "Vòng 8: Lịch sử các Nền Dân chủ",
    category: "Hình thái Nhà nước",
    question: "Với tư cách là một hình thái nhà nước trong lịch sử tiến hóa nhân loại, cho đến nay đã tồn tại những nền dân chủ nào?",
    image: "https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=800&auto=format&fit=crop&q=80",
    options: [
      "A. Dân chủ nguyên thủy, Dân chủ phong kiến, Dân chủ tư sản",
      "B. Dân chủ chủ nô, Dân chủ phong kiến, Dân chủ vô sản",
      "C. Dân chủ chủ nô, Dân chủ tư sản, Dân chủ xã hội chủ nghĩa",
      "D. Dân chủ quân sự, Dân chủ đại nghị, Dân chủ hiện đại"
    ],
    correctAnswer: "C",
    suggestion: "Lưu ý: Thời kỳ phong kiến là chế độ quân chủ chuyên chế độc tài, không có nền dân chủ.",
    description: "Lịch sử nhân loại có 3 nền dân chủ với tư cách hình thái nhà nước: Dân chủ chủ nô, Dân chủ tư sản và Dân chủ XHCN. Chế độ phong kiến chỉ có quan hệ 'thần dân - vua chúa'.",
    philosophicalNote: "Dân chủ XHCN là đỉnh cao tiến hóa, kế thừa có chọn lọc các giá trị tiến bộ của dân chủ tư sản và khắc phục triệt để hạn chế tư hữu.",
  },
  {
    id: 9,
    type: "catchphrase",
    title: "Vòng 9: Hình thức Dân chủ Sơ khai",
    category: "Lịch sử Xã hội Nguyên thủy",
    question: "Trong xã hội cộng sản nguyên thủy, hình thức manh nha của dân chủ thông qua Đại hội nhân dân bầu thủ lĩnh được Ph.Ăngghen gọi là gì?",
    image: "https://images.unsplash.com/photo-1533158326339-7f3cf2404354?w=800&auto=format&fit=crop&q=80",
    correctAnswer: "Dân chủ quân sự",
    acceptedAnswers: ["dân chủ quân sự", "dan chu quan su", "dân chủ nguyên thủy", "dan chu nguyen thuy", "dân chủ thị tộc", "dan chu thi toc"],
    suggestion: "Cụm từ gồm 4 tiếng (D... C... Q... S...). Xuất hiện trong các bộ lạc cổ sơ khi giải quyết công việc chung.",
    wordCount: 4,
    letterHint: "D _ _  C _ _  Q _ _ _  S _",
    description: "Ph.Ăngghen gọi hình thức sơ khai này là 'Dân chủ nguyên thủy' hay 'Dân chủ quân sự'. Mọi thành viên thị tộc đều có quyền biểu quyết tại Đại hội nhân dân bằng cách giơ tay hoặc hoan hô.",
    philosophicalNote: "Dân chủ xuất hiện từ nhu cầu tự quản tự nhiên của cộng đồng trước khi bị chế độ tư hữu và nhà nước giai cấp chia rẽ.",
  },
  {
    id: 10,
    type: "choice",
    title: "Vòng 10: Điều kiện Tiên quyết",
    category: "Xây dựng Thể chế XHCN",
    question: "Để nền dân chủ xã hội chủ nghĩa được thực hiện đầy đủ trong thực tiễn đời sống, điều kiện tiên quyết mang tính quyết định hàng đầu là gì?",
    image: "https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=800&auto=format&fit=crop&q=80",
    options: [
      "A. Thực hiện cơ chế đa nguyên chính trị, đa đảng đối lập để tạo cạnh tranh",
      "B. Bảo đảm vai trò lãnh đạo duy nhất của Đảng Cộng sản",
      "C. Tư nhân hóa toàn bộ các tập đoàn kinh tế nhà nước để thu hút đầu tư",
      "D. Tách rời hoàn toàn hệ thống pháp luật khỏi định hướng chính trị của giai cấp công nhân"
    ],
    correctAnswer: "B",
    suggestion: "Nhất nguyên chính trị dưới sự lãnh đạo kiên định của đội tiên phong cách mạng.",
    description: "Bảo đảm vai trò lãnh đạo duy nhất của Đảng Cộng sản là điều kiện tiên quyết hàng đầu. Nhờ nắm vững chủ nghĩa Mác - Lênin, Đảng định hướng phong trào quần chúng đi đúng con đường XHCN.",
    philosophicalNote: "Nhất nguyên chính trị và dân chủ XHCN không hề loại trừ nhau, mà sự lãnh đạo của Đảng là bảo chứng vững chắc nhất để quyền lực thực sự thuộc về đại đa số nhân dân.",
  },
];
