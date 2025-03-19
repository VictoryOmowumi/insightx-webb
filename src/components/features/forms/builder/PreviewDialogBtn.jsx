import { Button } from '@/components/ui/button';
import { MdPreview } from 'react-icons/md';
import useDesigner from '@/hooks/useDesigner';
import FormElements from './FormElements';
import blankCanva from '@/assets/blank-canva.svg';
import { Dialog, DialogTrigger, DialogContent } from '@/components/ui/dialog';

const PreviewDialogBtn = () => {
  const { elements } = useDesigner();
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button  className="bg-[#FCF8E5] dark:bg-neutral-800 dark:hover:bg-neutral-900 text-foreground hover:text-white shadow-none rounded-4xl">
          <MdPreview className="w-6 h-6" />
          Preview
        </Button>
      </DialogTrigger>
      <DialogContent 
        aria-label="Form Preview"
        aria-describedby="This is how your form will look like to your users"
      className='w-screen h-screen overflow-y-auto max-h-screen max-w-full flex flex-col flex-grow gap-0'>
        <div className="px-4 py-2 border-b">
          <p className="text-lg font-bold text-muted-foreground">Form Preview</p>
          <p className="text-sm text-muted-foreground">
            This is how your form will look like to your users
          </p>
          <div className="bg-white dark:bg-gray-400 flex flex-col flex-grow items-center justify-center p-4 overflow-y-auto">
            {
              elements.length === 0 ? (
                <div className="flex flex-col justify-center gap-2 items-center h-full">
                  <img src={blankCanva} alt="blank canvas" className="w-[300px] h-[300px]" />
                  <p className="text-xl text-center text-muted-foreground font-comfortaa font-medium">
                    Your form is empty. Add elements to see a preview
                  </p>
                </div>
              ) : (
                <div className="max-w-[620px] flex flex-col gap-4 flex-grow bg-background h-full w-full rounded-2xl p-8 overflow-y-auto">
                  {
                    elements.map(element => {
                      const FormComponent = FormElements[element.type].formComponent;

                      return <FormComponent key={element.id} elementInstance={element} />
                    })
                  }
                </div>
              )
            }
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default PreviewDialogBtn;