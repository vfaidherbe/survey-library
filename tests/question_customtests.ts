import { SurveyModel } from "../src/survey";
import { Question } from "../src/question";
import {
  QuestionCustomModel,
  QuestionCompositeModel,
  CustomQuestionCollection,
  CustomQuestionJSON,
} from "../src/question_custom";

export default QUnit.module("custom questions");

QUnit.test("Single: Register and load from json", function (assert) {
  var json = {
    name: "newquestion",
    questionJSON: { type: "dropdown", choices: [1, 2, 3, 4, 5] },
  };
  CustomQuestionCollection.Instance.add(json);
  var survey = new SurveyModel({
    elements: [{ type: "newquestion", name: "q1" }],
  });
  assert.equal(survey.getAllQuestions().length, 1, "Question is created");
  var q = <QuestionCustomModel>survey.getAllQuestions()[0];
  assert.equal(q.getType(), "newquestion", "type is correct");
  assert.equal(q.name, "q1", "name is correct");
  assert.equal(
    q.contentQuestion.getType(),
    "dropdown",
    "Type for question is correct"
  );
  assert.equal(q.contentQuestion.choices.length, 5, "There are five choices");
  assert.deepEqual(
    survey.toJSON(),
    {
      pages: [
        { name: "page1", elements: [{ type: "newquestion", name: "q1" }] },
      ],
    },
    "Seralized correctly"
  );
  CustomQuestionCollection.Instance.clear();
});

QUnit.test("Composite: Register and load from json", function (assert) {
  var json = {
    name: "customerinfo",
    elementsJSON: [
      { type: "text", name: "firstName" },
      { type: "text", name: "lastName" },
    ],
  };
  CustomQuestionCollection.Instance.add(json);
  var survey = new SurveyModel({
    elements: [{ type: "customerinfo", name: "q1" }],
  });
  assert.equal(survey.getAllQuestions().length, 1, "Question is created");
  var q = <QuestionCompositeModel>survey.getAllQuestions()[0];
  assert.equal(q.getType(), "customerinfo", "type is correct");
  assert.equal(q.name, "q1", "name is correct");
  assert.equal(
    q.contentPanel.elements.length,
    2,
    "There are two elements in panel"
  );
  CustomQuestionCollection.Instance.clear();
});

QUnit.test("Single: Create the wrapper question and sync the value", function (
  assert
) {
  var json = {
    name: "newquestion",
    questionJSON: { type: "dropdown", choices: [1, 2, 3, 4, 5] },
  };
  CustomQuestionCollection.Instance.add(json);
  var survey = new SurveyModel({
    elements: [{ type: "newquestion", name: "q1" }],
  });
  var q = <QuestionCustomModel>survey.getAllQuestions()[0];
  assert.equal(
    q.contentQuestion.getType(),
    "dropdown",
    "Question the type was created"
  );
  q.value = 1;
  assert.equal(q.contentQuestion.value, 1, "Set value to wrapper value");
  q.contentQuestion.value = 2;
  assert.equal(q.value, 2, "Set value to custom question");
  CustomQuestionCollection.Instance.clear();
});

QUnit.test("Composite: sync values", function (assert) {
  var json = {
    name: "customerinfo",
    elementsJSON: [
      { type: "text", name: "firstName" },
      { type: "text", name: "lastName" },
    ],
  };
  CustomQuestionCollection.Instance.add(json);
  var survey = new SurveyModel({
    elements: [{ type: "customerinfo", name: "q1" }],
  });
  var q = <QuestionCompositeModel>survey.getAllQuestions()[0];
  var firstName = q.contentPanel.getQuestionByName("firstName");
  var lastName = q.contentPanel.getQuestionByName("lastName");
  firstName.value = "John";
  assert.deepEqual(survey.data, { q1: { firstName: "John" } });
  q.value = { firstName: "Andrew", lastName: "Telnov" };
  assert.equal(firstName.value, "Andrew", "question value is replaced");
  assert.equal(lastName.value, "Telnov", "question value is set");
  CustomQuestionCollection.Instance.clear();
});
QUnit.test("Single: disableDesignActions property", function (assert) {
  var json = {
    name: "newquestion",
    questionJSON: { type: "dropdown", choices: [1, 2, 3, 4, 5] },
  };
  CustomQuestionCollection.Instance.add(json);
  var survey = new SurveyModel({
    elements: [{ type: "newquestion", name: "q1" }],
  });
  var q = <QuestionCustomModel>survey.getAllQuestions()[0];
  assert.equal(
    q.disableDesignActions,
    false,
    "Design action is available for root"
  );
  assert.equal(
    q.contentQuestion.disableDesignActions,
    true,
    "Design action is disabled for contentQuestion"
  );
  CustomQuestionCollection.Instance.clear();
});
QUnit.test("Composite: disableDesignActions property", function (assert) {
  var json = {
    name: "customerinfo",
    elementsJSON: [
      { type: "text", name: "firstName" },
      { type: "text", name: "lastName" },
    ],
  };
  CustomQuestionCollection.Instance.add(json);
  var survey = new SurveyModel({
    elements: [{ type: "customerinfo", name: "q1" }],
  });
  var q = <QuestionCompositeModel>survey.getAllQuestions()[0];
  var firstName = q.contentPanel.getQuestionByName("firstName");
  assert.equal(
    q.disableDesignActions,
    false,
    "Design action is available for root"
  );
  assert.equal(
    q.contentPanel.disableDesignActions,
    true,
    "Design action is disabled for contentPanel"
  );
  assert.equal(
    firstName.disableDesignActions,
    true,
    "Design action is disabled for firstName"
  );
  CustomQuestionCollection.Instance.clear();
});
