import { FC, ReactNode } from "react"
import {
  bodyChooserStyle,
  bodyEditorContainerStyle,
  bodyLabelStyle,
  bodySelectorStyle,
} from "./style"
import { useTranslation } from "react-i18next"
import { BodyEditorProps } from "@/page/App/components/Actions/ActionPanel/RestApiPanel/BodyEditor/interface"
import { Select } from "@illa-design/select"
import {
  BinaryBody,
  BodyContent,
  BodyType,
  FormDataBody,
  RawBody,
  RawBodyContent,
  XWWWFormURLEncodedBody,
} from "@/redux/currentApp/action/restapiAction"
import { RecordEditor } from "@/page/App/components/Actions/ActionPanel/RecordEditor"
import { CodeEditor } from "@/components/CodeEditor"
import { VALIDATION_TYPES } from "@/utils/validationFactory"
import { CodeEditorMode } from "@/components/CodeEditor/interface"
import { Params } from "@/redux/resource/resourceState"

function getBodyEditorComponent(
  bodyType: BodyType,
  body: BodyContent,
  onChangeBody: (body: BodyContent) => void,
): ReactNode {
  switch (bodyType) {
    case "none":
      return null
    case "form-data":
      return (
        <RecordEditor
          label=""
          records={body as FormDataBody}
          onAdd={() => {
            onChangeBody([
              ...(body as FormDataBody),
              { key: "", value: "" } as Params,
            ])
          }}
          onDelete={(index, record) => {
            const params = [...(body as FormDataBody)]
            params.splice(index, 1)
            onChangeBody(params)
          }}
          onChangeKey={(index, key, value) => {}}
          onChangeValue={(index, key, value) => {}}
        />
      )
    case "x-www-form-urlencoded":
      return (
        <RecordEditor
          label=""
          records={body as XWWWFormURLEncodedBody}
          onAdd={() => {
            onChangeBody([
              ...(body as FormDataBody),
              { key: "", value: "" } as Params,
            ])
          }}
          onDelete={(index, record) => {
            const params = [...(body as FormDataBody)]
            params.splice(index, 1)
            onChangeBody(params)
          }}
          onChangeKey={(index, key, value) => {}}
          onChangeValue={(index, key, value) => {}}
        />
      )
    case "raw":
      const rawBody = body as RawBody<RawBodyContent>
      let mode: CodeEditorMode = "TEXT_JS"
      switch (rawBody.type) {
        case "text":
          mode = "TEXT_JS"
          break
        case "json":
          mode = "JSON_JS"
          break
        case "xml":
          mode = "XML_JS"
          break
        case "javascript":
          mode = "JAVASCRIPT"
          break
        case "html":
          mode = "HTML_JS"
          break
      }
      return (
        <CodeEditor
          lineNumbers
          mode={mode}
          value={body as RawBodyContent}
          expectedType={VALIDATION_TYPES.STRING}
          height="88px"
          onChange={(value) => {
            onChangeBody({
              type: rawBody.type,
              content: value,
            })
          }}
        />
      )
    case "binary":
      return (
        <CodeEditor
          mode="TEXT_JS"
          value={body as BinaryBody}
          expectedType={VALIDATION_TYPES.STRING}
          height="88px"
          onChange={(value) => {
            onChangeBody(value)
          }}
        />
      )
  }
}

export const BodyEditor: FC<BodyEditorProps> = (props) => {
  const {
    body,
    bodyType,
    onChangeBodyType,
    onChangeRawBodyType,
    onChangeBody,
  } = props
  const { t } = useTranslation()

  return (
    <div css={bodyEditorContainerStyle}>
      <span css={bodyLabelStyle}>
        {t("editor.action.resource.restapi.label.body")}
      </span>
      <div css={bodyChooserStyle}>
        <div css={bodySelectorStyle}>
          <Select
            colorScheme="techPurple"
            value={bodyType}
            options={[
              "none",
              "form-data",
              "x-www-form-urlencoded",
              "raw",
              "binary",
            ]}
            borderRadius={bodyType === "raw" ? " 8px 0 0 8px" : "8px"}
            onChange={(value) => {
              onChangeBodyType(value)
            }}
          />
          {bodyType === "raw" && (
            <Select
              borderRadius="0 8px 8px 0"
              colorScheme="techPurple"
              width="162px"
              value={(body as RawBody<RawBodyContent>).type}
              options={["text", "json", "xml", "javascript", "html"]}
              onChange={(value) => {
                onChangeRawBodyType(value)
              }}
            />
          )}
        </div>
        {getBodyEditorComponent(bodyType, body, onChangeBody)}
      </div>
    </div>
  )
}

BodyEditor.displayName = "BodyEditor"