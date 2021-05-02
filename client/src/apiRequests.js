import axios from "axios";

const baseEndpoint = "http://localhost:5000/";
export let sessionId = "";
let latestResponse = {};

export const getSessionId = async () => {
  await axios.get(baseEndpoint + "api/session").then((res) => {
    sessionId = res.data.result.session_id;
  });
  return sessionId;
};

export const sendMessage = async (message) => {
  let context = {};
  if (latestResponse) {
    context = latestResponse.context;
  }

  const body = {
    session_id: sessionId,
    input: {
      message_type: "text",
      text: message,
      options: { return_context: true },
      context: {},
    },
    context: {
      skills: {},
    },
  };
  if (context) {
    body.context = context;
  }
  let watsonAnswear = "";
  let responses = [];
  await axios.post(baseEndpoint + "api/message", body).then((res) => {
    latestResponse = res.data.result;
    const generic = res.data.result.output.generic;
    generic.forEach((gen) => {
      getResponse(responses, gen);
    });
    watsonAnswear = {
      isUser: false,
      message: [...responses],
    };
  });
  return watsonAnswear;
};

const getResponse = (responses, gen) => {
  var title = "",
    description = "";
  if (gen.hasOwnProperty("title")) {
    title = gen.title;
  }
  if (gen.hasOwnProperty("description")) {
    description = "<div>" + gen.description + "</div>";
  }
  if (gen.response_type === "image") {
    responses.push({
      type: gen.response_type,
      image: { title, description, source: gen.source },
    });
  } else if (gen.response_type === "text") {
    responses.push({
      type: gen.response_type,
      innerhtml: gen.text,
    });
  } else if (gen.response_type === "pause") {
    responses.push({
      type: gen.response_type,
      time: gen.time,
      typing: gen.typing,
    });
  } else if (gen.response_type === "option") {
    var preference = "text";
    if (gen.hasOwnProperty("preference")) {
      preference = gen.preference;
    }

    var list = getOptions(gen.options, preference);
    responses.push({
      type: gen.response_type,
      option: { title, description, list },
    });
  }
};

const getOptions = (optionsList, preference) => {
  var list = [];
  var i = 0;
  if (optionsList !== null) {
    if (preference === "text") {
      for (i = 0; i < optionsList.length; i++) {
        if (optionsList[i].value) {
          list.push({
            valueToSendFromUser: optionsList[i].value.input.text,
            label: optionsList[i].label,
          });
        }
      }
    }
  }
  return list;
};
