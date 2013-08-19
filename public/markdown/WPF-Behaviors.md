#Behaviors

##References
- http://wpftutorial.net/Behaviors.html 
- http://www.codeproject.com/Articles/28959/Introduction-to-Attached-Behaviors-in-WPF

##What are behaviors?

The Attached Behavior pattern encapsulates "behavior" (usually user interactivity) into a class outside the visual heirarchy and allows it to be applied to a visual element by setting an attached property and hooking various events on the visual element.

Example of Behavior 
ClickBehavior - can be DoubleClickCommand 
Grid behavior - DoubleClickCommand

There are two types of behavior 
Attached Behavior, a dependency Property registered with DependencyProperty.RegisterAttached 
Blend Behavior 
Inherits from Behavior<T> (T could be UIElement)

[Blend SDK Notes](http://msdn.microsoft.com/en-us/library/ee341376%28v=expression.40%29.aspx) 
From Expression Blend API 
Attached Properties: Interaction.Triggers, Interaction.Behaviors

    <Button  Content="Submit" Height="23" IsEnabled="{Binding CanSubmit}"  HorizontalAlignment="Right" x:Name="button2" Width="75">

    <i:Interaction.Triggers> 
        <i:EventTrigger EventName="Click"> 
            <ei:CallMethodAction TargetObject="{Binding}" MethodName="Submit"/> 
        </i:EventTrigger> 
    </i:Interaction.Triggers> 
	</Button> 
or 

	<Border Background="LightBlue" > 
        <e:Interaction.Behaviors> 
                <b:DragBehavior/> 
        </e:Interaction.Behaviors> 
        <TextBlock Text="Drag me around!" /> 
	</Border>

Using a behavior to close a form
	
		using System; 
		using System.ComponentModel; 
		using System.Windows; 
		using System.Windows.Forms; 
		using System.Windows.Input; 
		using Microsoft.Practices.Prism.Commands; 
		using MessageBox = System.Windows.MessageBox;
	
		namespace WpfApplication2 
		{ 
		    public partial class MainWindow : Window 
		    { 
		        public MainWindow() 
		        { 
		            InitializeComponent(); 
		        }
	
	        private void ButtonBase_OnClick(object sender, RoutedEventArgs e) 
	        { 
	            DialogBox dialog = new DialogBox(); 
	            dialog.DataContext = new DialogViewModel(); 
	            var result = dialog.ShowDialog(); 
	            MessageBox.Show(result.ToString()); 
	        } 
	    }
	
	    public class DialogViewModel : INotifyPropertyChanged 
	    { 
	        public DialogViewModel() 
	        { 
	            Text = "Hello World"; 
	        }
	
	        private bool? dialogResult; 
	        private string text;
	
	        public bool? DialogResult 
	        { 
	            get { return dialogResult; } 
	            set 
	            {   dialogResult = value; 
	                OnPropertyChanged("DialogResult"); 
	            } 
	        }
	
	        public string Text 
	        { 
	            get { return text; } 
	            set { text = value; 
	                OnPropertyChanged("Text"); 
	            } 
	        }
	
	        public ICommand CloseCommand 
	        { 
	            get 
	            { 
	                if (closeCommand == null) 
	                { 
	                    return closeCommand = new DelegateCommand(() => DialogResult = true); 
	                } 
	                return closeCommand; 
	            } 
	        }
	
	        private ICommand closeCommand;
	
	        public event PropertyChangedEventHandler PropertyChanged; 
	        
	        protected virtual void OnPropertyChanged(string propertyName) 
	        { 
	            var handler = PropertyChanged; 
	            if (handler != null) handler(this, new PropertyChangedEventArgs(propertyName)); 
	        } 
	    }
	
	    public static class DialogCloser 
	    { 
	        public static readonly DependencyProperty DialogResultProperty = 
	            DependencyProperty.RegisterAttached( 
	                "DialogResult", 
	                typeof(bool?), 
	                typeof(DialogCloser), 
	                new PropertyMetadata(DialogResultChanged));
	
	        private static void DialogResultChanged( 
	            DependencyObject d, 
	            DependencyPropertyChangedEventArgs e) 
	        { 
	            var window = d as Window; 
	            if (window != null) 
	                window.DialogResult = e.NewValue as bool?; 
	        } 
	        public static void SetDialogResult(Window target, bool? value) 
	        { 
	            target.SetValue(DialogResultProperty, value); 
	        } 
	    } 
	}

	<Window x:Class="WpfApplication2.DialogBox" 
	        xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation" 
	        xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml" xmlns:wpfApplication2="clr-namespace:WpfApplication2" 
	        Title="DialogBox" Height="300" Width="300" wpfApplication2:DialogCloser.DialogResult="{Binding DialogResult}"> 
	    <Grid> 
	        <Button Command="{Binding CloseCommand}">Close Me</Button> 
	    </Grid> 
	</Window>

