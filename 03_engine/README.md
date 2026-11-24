# EduApp Agent

Agent nhận **một mô tả ngắn (~100 từ)** của giáo viên, ví dụ:

> "Tôi là giáo viên cấp 1, tôi phải có giải pháp khuyến khích, đánh giá học sinh để kích thích tinh thần học tập thì sẽ làm cách nào?"

và trả về **một web app chạy được** giải quyết bài toán đó. Cách làm rút ra từ dự án [AI-ClassMate-2G3](../../README.md).

## Pipeline

```
 Mô tả ~100 từ
   │
 ① Intake ────────── hiểu bài toán, hỏi ≤5 câu có lựa chọn        (Claude, structured output)
 ② Designer ──────── 2-3 mô hình giải pháp sư phạm, gợi ý 1       (Claude + knowledge/)
 ③ Spec Builder ──── AppSpec.json, tự sửa theo linter              (Claude + spec/lint.ts)
 ④ Gate ──────────── người dùng duyệt / yêu cầu sửa bằng lời
 ⑤ Generator ─────── dựng app khung từ template                   (không dùng LLM)
   Codegen ───────── viết phần đặc thù: rules, hooks, màn hình     (Claude + tool, chỉ ghi file cho phép)
 ⑥ Verifier ──────── npm test → typecheck → build, lỗi thì quay lại Codegen (tối đa 3 vòng)
 ⑦ Deliver ──────── app + HUONG_DAN.md + danh sách quy tắc chờ xác nhận
```

Mọi sản phẩm trung gian lưu ở `runs/<thời-gian>/` (brief, câu trả lời, thiết kế, spec, log kiểm tra, token đã dùng).

## Nguyên tắc thiết kế (học từ AI-ClassMate-2G3)

| Ý hay của ClassMate | Agent làm thế nào |
|---|---|
| Quy tắc có trạng thái `PENDING / CONFIRMED` | Spec bắt buộc gắn trạng thái; app có màn hình xác nhận; hook chỉ chặn khi đã CONFIRMED |
| Code tính điểm, AI chỉ viết lời | Rule = hàm thuần + test sinh từ ví dụ; AI nhận số liệu đã tính sẵn |
| Human-in-the-loop | Linter từ chối `ai_task` nếu không yêu cầu duyệt; AI chỉ tạo bản nháp |
| Lưu vết, ô trống ≠ 0 | Có sẵn trong `template/src/lib/store.ts` |

| Điểm yếu của ClassMate | Agent sửa thế nào |
|---|---|
| Hơn 60 file .md lệch nhau | Một file `AppSpec` JSON + linter kiểm tra chéo |
| AI là template if/else | Gọi Claude thật, prompt riêng cho từng tác vụ |
| Stack nặng (FastAPI + Next + Postgres + Docker) | Một stack Next.js, dữ liệu file JSON cục bộ |

## Cấu trúc

```
src/
  spec/schema.ts        AppSpec (Zod) — hợp đồng giữa các stage
  spec/lint.ts          kiểm tra chéo spec
  generator/index.ts    spec + template → app khung (tất định)
  stages/               intake, designer, specBuilder, codegen, verifier
  orchestrator.ts       chạy pipeline, lưu runs/
  cli.ts                giao diện dòng lệnh
  llm.ts, config.ts     gọi Claude, model/effort theo stage
prompts/                system prompt từng stage + _core_rules.md (trỏ về ../02_prompts)
knowledge/              kiến thức sư phạm cho Designer (trỏ về ../01_process/04_knowledge)
spec/examples/
  classmate-2g3.json             spec mẫu (golden) chuyển từ SRS của ClassMate
  classmate-2g3.reference/       phần "LLM viết" do người viết tay — ví dụ cho Codegen
template/               app Next.js 16 điều khiển bởi spec (menu, CRUD, Trợ lý AI, Quy tắc)
tests/                  test không gọi LLM
```

## Sử dụng

```bash
npm install
cp .env.example .env          # điền ANTHROPIC_API_KEY (hoặc dùng `ant auth login`)

npm run agent                                   # tương tác: nhập mô tả, trả lời câu hỏi
npm run agent -- "Tôi là giáo viên cấp 1, ..."   # truyền mô tả trực tiếp
npm run agent -- --auto "..."                    # không hỏi, dùng mọi mặc định (cho evals)
npm run agent -- --spec spec/examples/classmate-2g3.json   # bỏ qua ①-④, sinh từ spec có sẵn
```

Công cụ không cần API key:

```bash
npm test                                         # test linter, generator, schema
npm run lint-spec -- spec/examples/classmate-2g3.json
npm run generate -- spec/examples/classmate-2g3.json runs/thu   # chỉ dựng app khung
npm run verify-reference                         # app ClassMate + bản tham chiếu → test/typecheck/build
```

Chạy app tham chiếu: `cd runs/reference-classmate && npm run dev` → http://localhost:3000

## Model

Mặc định mọi stage dùng `claude-opus-5-5` (effort: intake `low`, còn lại `high`), có server-side fallback khi bị từ chối. Đổi model từng stage bằng biến `EDUAGENT_MODEL_*` trong `.env`.

## Bước tiếp theo

1. Chạy thật với API key trên 3-5 đề bài, xem `runs/*/usage.json` để biết chi phí mỗi app.
2. Viết bộ đề `evals/` (~15 đề) và chấm tự động: build pass, test rule pass, số câu hỏi, vi phạm quy tắc cứng.
3. Thêm 2 spec mẫu khác lĩnh vực (thư viện lớp, bài tập về nhà) để Spec Builder không bị "học thuộc" ClassMate.
4. Giao diện web thay CLI (orchestrator đã tách `UI` interface).
