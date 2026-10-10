<script lang="ts">
  import type {
    MultipleChoiceQuestion,
    PackageQuestion,
    Question,
    RadioQuestion,
    TextQuestion,
  } from "./config";
  import TextArea from "./TextArea.svelte";

  let {
    question,
    index,
    value = $bindable(""),
  }: {
    question: Question &
      (PackageQuestion | MultipleChoiceQuestion | RadioQuestion | TextQuestion);
    index: number;
    value: string;
  } = $props();
</script>

<div class="w-full">
  {#if question.intro}
    <p class="text-xl">
      {question.intro}
    </p>
  {/if}
  {#if question.type == "text"}
    <label class="flex flex-col">
      <span class="mb-6 text-2xl">
        <span class="text-3xl font-bold">{index + 1}.</span>
        {question.label}
      </span>
      <input
        class="border border-gray-500 rounded-bl-xl rounded-tr-xl p-3 text-xl"
        type="text"
        name={question.name}
        id={question.id}
        bind:value
        required
      />
    </label>
  {:else if question.type == "long-text"}
    <label class="text-2xl flex flex-col">
      <span class="mb-6">
        <span class="text-3xl font-bold">{index + 1}.</span>
        {question.label}
      </span>
      <TextArea name={question.name} id={question.id} bind:value required
      ></TextArea>
    </label>
  {:else if question.type == "radio"}
    <fieldset>
      <legend class="mb-6 text-2xl">
        <span class="text-3xl font-bold">{index + 1}.</span>
        {question.label}
      </legend>
      <div class="flex flex-col text-xl">
        {#each question.choices as choice}
          <label class="cursor-pointer">
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
      </div>
    </fieldset>
  {:else if question.type == "multiple-choice"}
    <fieldset>
      <legend class="mb-6 text-2xl">
        <span class="text-3xl font-bold">{index + 1}.</span>
        {question.label}
      </legend>
      <div class="flex flex-col">
        {#each question.choices as choice}
          <label class="cursor-pointer text-xl">
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
      </div>
    </fieldset>
  {:else if question.type == "package"}
    <fieldset class="text-2xl">
      <legend class="mb-6">
        <span class="text-3xl font-bold">{index + 1}.</span>
        {question.label}
      </legend>
      <div class="flex justify-evenly">
        {#each question.choices as choice}
          <div
            class="grow overflow-clip first:rounded-tl-xl last:rounded-tr-xl first:border-r-0 last:border-l-0 border border-b-0 border-gray-400 hover:bg-gray-600"
          >
            <input
              class="appearance-none peer h-0 w-0 block"
              type="radio"
              bind:group={value}
              name={choice}
              id={choice.toLowerCase()}
              value={choice}
            />
            <label
              class="text-center p-4 select-none peer-checked:bg-gray-700 block cursor-pointer border-b border-gray-400 peer-checked:border-gray-700 peer-not-checked:border-b peer-checked:underline"
              for={choice.toLowerCase()}
            >
              {choice}
            </label>
          </div>
        {/each}
      </div>
      <div
        class="package-description border border-t-0 border-gray-400 w-full p-4 rounded-b-xl text-xl {value
          ? 'bg-gray-700'
          : ''}"
      >
        {@html value
          ? question.choiceDescriptions[
              question.choices.findIndex((v) => v === value)
            ]
          : "Select a package to see it's description."}
      </div>
    </fieldset>
  {/if}
</div>

<style>
  .package-description :global(ul) {
    list-style-type: "- ";
    list-style-position: outside;
    margin-left: 24px;
  }
</style>
