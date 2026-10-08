<script lang="ts">
  import type {
    MultipleChoiceQuestion,
    PackageQuestion,
    Question,
    RadioQuestion,
    TextQuestion,
  } from "./config";

  let {
    question,
    value = $bindable(""),
  }: {
    question: Question &
      (PackageQuestion | MultipleChoiceQuestion | RadioQuestion | TextQuestion);
    value: string;
  } = $props();
</script>

<div>
  {#if question.intro}
    <p>
      {question.intro}
    </p>
  {/if}
  {#if question.type == "text"}
    <label>
      {question.label}
      <input
        type="text"
        name={question.name}
        id={question.id}
        bind:value
        required
      />
    </label>
  {:else if question.type == "long-text"}
    <label>
      {question.label}
      <textarea name={question.name} id={question.id} bind:value required>
      </textarea>
    </label>
  {:else if question.type == "radio"}
    <fieldset>
      <legend>{question.label}</legend>
      {#each question.choices as choice}
        <label>
          <input
            type="radio"
            bind:group={value}
            name={choice}
            id={choice.toLowerCase()}
            value={choice}
          />
          {choice}
        </label>
      {/each}
    </fieldset>
  {:else if question.type == "multiple-choice"}
    <fieldset>
      <legend>{question.label}</legend>
      {#each question.choices as choice}
        <label>
          <input
            type="checkbox"
            bind:group={value}
            name={choice}
            id={choice.toLowerCase()}
            value={choice}
          />
          {choice}
        </label>
      {/each}
    </fieldset>
  {:else if question.type == "package"}
    <fieldset>
      <legend>{question.label}</legend>
      {#each question.choices as choice}
        <label>
          <input
            type="radio"
            bind:group={value}
            name={choice}
            id={choice.toLowerCase()}
            value={choice}
          />
          {choice}
        </label>
      {/each}
    </fieldset>
  {/if}
</div>
{question}
